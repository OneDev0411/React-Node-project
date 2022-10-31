import React from "@libs/react"
import ReactUse from "@libs/react-use"
import Ui from "@libs/material-ui"
import useApp from "../../../../hooks/useApp"
import { GCISplitStatus, IQuestionProps, IRoleData } from "../../../../models/type"
import { sortRole } from "../../../../util"
import GCIInfoItem from "./item"

const GCISplitQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal, roles },
  Components: { RoleForm, AgentsPicker },
  api: { deleteRole },
}) => {
  const { useState, useEffect } = React
  const { useDebounce } = ReactUse
  const { Grid, Button, Box, IconButton, TextField, Select, MenuItem } = Ui
  const wizard = useWizardContext()
  const { step } = useSectionContext()
  const { dealData, setDealData, roleData, setRoleData, submitted, setSubmitted, currentStep, setCurrentStep } = useApp()
  
  // state
  const [_roleData, _setRoleData] = useState<IRoleData[]>(roleData)
  const [status, setStatus] = useState<GCISplitStatus>("Listing")
  const [currentRole, setCurrentObject] = useState<Partial<IDealFormRole> | IDealRole | null>(null) // data from dropdown select, can be IDealRole object or nameObject
  const [showButton, setShowButton] = useState<boolean>(true)
  const [totalPercent, setTotalPercent] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)
  const [_reasonValue, _setReasonValue] = useState<number>(dealData.gci_reason_select)
  const [_reasonNote, _setReasonNote] = useState<string>("")

  // constants
  const price = deal.property_type.is_lease ? deal.context.leased_price?.number : deal.context.sales_price?.number
  const enderType = deal.context.ender_type?.text
  const dealType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? "Both" : deal.deal_type

  const showReason = dealType === "Both" ? totalPercent < 4 : totalPercent < 2

  const notFinishCase1 = showReason && _reasonValue === -1 // not selected reason
  const notFinishCase2 = showReason && _reasonValue === 2 && _reasonNote === "" // not completed reason note
  const isShowButton = showButton && !(notFinishCase1 || notFinishCase2)

  let allowedRoles
  if (dealType === "Both") {
    allowedRoles = ["CoBuyerAgent", "SellerAgent", "CoSellerAgent"]
  } else {
    if (dealType === "Buying") {
      allowedRoles = ["CoBuyerAgent"]
    } else {
      allowedRoles = ["SellerAgent", "CoSellerAgent"]
    }
  }

  const handleChangeReasonTextField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    _setReasonNote(event.target.value)
  }

  const handleSelectReason = (event: React.ChangeEvent<{ value: unknown }>) => {
    _setReasonValue(Number(event.target.value))
  }

  const handleUpsertRole = (agentRole: IDealRole) => {
    const { id, legal_full_name, role, commission_percentage, commission_dollar } = agentRole
    const roleDt: IRoleData = {
      deal: deal.id,
      role_id: id,
      legal_full_name: legal_full_name,
      role: role,
      share_percent: commission_percentage ? commission_percentage : parseFloat(((Number(commission_dollar) / price) * 100).toFixed(3)),
      share_value: commission_dollar ? commission_dollar : parseFloat(((price / 100) * Number(commission_percentage)).toFixed(3)),
      note: "",
    }
    
    let temp = _roleData.slice()
    temp.push(roleDt)
    temp.sort((a: IRoleData, b: IRoleData) => { 
      const key1 = a.role
      const key2 = b.role
      const diff = sortRole[key1 as keyof typeof sortRole] - sortRole[key2 as keyof typeof sortRole]
      return diff ? diff : a.legal_full_name.localeCompare(b.legal_full_name)
    })
    _setRoleData(temp)
    
    // calculate total percent and value when mounted
    let tempClc = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent ? data.share_percent : (Number(data.share_value) / price * 100))).toFixed(3)
      )
    }, 0)
    setTotalPercent(tempClc)
    tempClc = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalValue) + Number(data.share_value ? data.share_value : (Number(data.share_percent) * price / 100))).toFixed(3)
      )
    }, 0)
    setTotalValue(tempClc)
  }

  // this logic is updating
  const handleCloseRoleForm = () => {
    // in case of no match role, ignore cancel action
    setStatus("Listing")
    setCurrentObject(null)
  }

  const handleSelectAgent = (agent: BrandedUser) => {
    const contact: Partial<IDealFormRole> = {
      legal_first_name: String(agent.first_name),
      legal_last_name: String(agent.last_name),
      email: agent.email,
      phone_number: String(agent.phone_number),
      agents: agent.agents,
      user: agent,
    }
    setCurrentObject(contact)
    setStatus("Inserting")
  }

  const handleClickAddAnotherButton = () => {
    setStatus("Selecting")
  }

  const handleClickNextButton = async () => {
    setShowButton(false)
    let temp = JSON.parse(JSON.stringify(dealData))
    temp.current_step = step + 1
    if (setDealData !== undefined)
      setDealData(temp)
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next()
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1)
        }
      }
    }, 80)
  }

  const handleClickCancelAddButton = () => {
    setStatus("Listing")
  }

  const isPrimaryAgent = (role: IRoleData["role"]) => {
    return (
      (role === "BuyerAgent" && dealType === "Buying") ||
      (role === "SellerAgent" && dealType === "Selling")
    )
  }

  const handleClickRemoveButton = async (data: IRoleData, index: number) => {
    const roleModel = roles.find((role: IDealRole) => role.id == data.role_id)
    if (roleModel !== undefined) {
      await deleteRole(roleModel)
    }

    // for display deleting result
    let temp = JSON.parse(JSON.stringify(_roleData))
    temp.splice(index, 1)
    _setRoleData(temp)

    // calculate total percent and value when mounted
    let tempClc = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent ? data.share_percent : (Number(data.share_value) / price * 100))).toFixed(3)
      )
    }, 0)
    setTotalPercent(tempClc)
    tempClc = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalValue) + Number(data.share_value ? data.share_value : (Number(data.share_percent) * price / 100))).toFixed(3)
      )
    }, 0)
    setTotalValue(tempClc)
  }

  const updateFlag = (flag: boolean) => {
    if (submitted != 1 && wizard.currentStep < step + 1) {
      setShowButton(flag)
    }
  }

  // calculate total percent and value when roleData is changed
  const totalClc = (index: number, data: IRoleData, clcFlag: boolean) => {
    let temp = JSON.parse(JSON.stringify(_roleData))
    temp[index] = data
    if (clcFlag) {
      let tempValue = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: number, data: IRoleData) => {
        return parseFloat(
          (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
        )
      }, 0)
      setTotalPercent(tempValue)
      tempValue = temp.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: number, data: IRoleData) => {
        return parseFloat(
          (Number(totalValue) + Number(data.share_value)).toFixed(3)
        )
      }, 0)
      setTotalValue(tempValue)
    }
    _setRoleData(temp)
  }

  useEffect(() => {
    if (submitted === 1 || currentStep > step)
      setShowButton(false)
    else
      setShowButton(true)

    // calculate total percent and value when mounted
    let tempClc = _roleData.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent ? data.share_percent : (Number(data.share_value) / price * 100))).toFixed(3)
      )
    }, 0)
    setTotalPercent(tempClc)
    tempClc = _roleData.filter((item: IRoleData) => dealType === "Both" ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalValue) + Number(data.share_value ? data.share_value : (Number(data.share_percent) * price / 100))).toFixed(3)
      )
    }, 0)
    setTotalValue(tempClc)
  }, [])

  // save data to global state 0.5s after data is changed
  useDebounce(
    () => {
      let temp = JSON.parse(JSON.stringify(dealData))
      temp.gci_de_value = price * totalPercent / 100
      if (
        (totalPercent < 2 && dealType !== "Both") ||
        (totalPercent < 4 && dealType === "Both")
      ) {
        temp.gci_reason_select = _reasonValue
        if (_reasonValue === 2) {
          temp.gci_reason = _reasonNote
        }
      }
      if (setDealData !== undefined) {
        setDealData(temp)
      }
      if (setRoleData !== undefined) {
        setRoleData(_roleData)
      }
      if (submitted === 1) {
        if (setSubmitted !== undefined) {
          setSubmitted(2)
        }
      }
    },
    500,
    [_roleData, _reasonValue, _reasonNote]
  )

  return (
    <QuestionSection>
      <QuestionTitle>
        Great, here is your GCI share before splits:
      </QuestionTitle>
      <QuestionForm>
        {_roleData.map((item: IRoleData, id: number) => (
          <React.Fragment key={item.role_id}>
            {(dealType === "Buying" || dealType === "Both") && 
              (item.role == "BuyerAgent" ||
                item.role == "CoBuyerAgent" ||
                item.role == "BuyerReferral") &&
              <Box style={{
                marginBottom: 20,
                padding: 15,
                paddingTop: 15,
                paddingRight: 10,
                display: 'inline-block',
                position: 'relative', 
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: 4
              }}>
                {_roleData.length > 1 && isPrimaryAgent(item.role) != true &&
                  <IconButton
                    size="small"
                    style={{ 
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 7,
                      height: 5 
                    }} 
                    onClick={() => handleClickRemoveButton(item, id)}
                  >
                    x
                  </IconButton>
                }
                <GCIInfoItem
                  Ui={Ui}
                  key={id}
                  index={id}
                  price={price}
                  saveData={{ updateFlag }}
                  totalClc={totalClc}
                  role={item}
                />
              </Box>
            }
            {(dealType == "Selling" || dealType === "Both") && 
              (item.role == "SellerAgent" ||
                item.role == "CoSellerAgent" ||
                item.role == "SellerReferral") && 
              <Box style={{
                marginBottom: 20,
                padding: 15,
                paddingTop: 15,
                paddingRight: 10,
                display: 'inline-block',
                position: 'relative', 
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: 4
              }}>
                {_roleData.length > 1 && isPrimaryAgent(item.role) != true &&
                  <IconButton
                    size="small"
                    style={{ 
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 7,
                      height: 5 
                    }} 
                    onClick={() => handleClickRemoveButton(item, id)}
                  >
                    x
                  </IconButton>
                }
                <GCIInfoItem
                  Ui={Ui}
                  key={id}
                  index={id}
                  price={price}
                  saveData={{ updateFlag }}
                  totalClc={totalClc}
                  role={item}
                />
              </Box>
            }
          </React.Fragment>
        ))}
        {status === "Listing" && (
          <>
            <Button
              variant="outlined"
              onClick={handleClickAddAnotherButton}
              style={{
                color: "black !important",
                borderColor: "#dbdbdb !important",
                paddingBottom: 2,
                paddingTop: 2,
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              + Add More Agents
            </Button>

            <Grid container spacing={2} style={{ paddingBottom: 30 }}>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <label style={{ fontWeight: 300 }}>
                  Total: <strong>{totalPercent}%</strong>
                </label>
              </Grid>
              <Grid item xs={4} style={{ paddingLeft: 0 }}>
                <label style={{ fontWeight: 300 }}>
                  Total: <strong>${totalValue}</strong>
                </label>
              </Grid>
            </Grid>
          </>
        )}
        {status === "Inserting" && (
          <Box className="adding-role-form-box">
            <RoleForm
              isOpen
              deal={deal}
              onUpsertRole={handleUpsertRole}
              onClose={handleCloseRoleForm}
              title=" "
              form={
                { ...currentRole }
              }
              allowedRoles={
                allowedRoles
              }
            />
          </Box>
        )}
        {status === "Selecting" && (
          <>
            <AgentsPicker
              flattenTeams={true}
              isPrimaryAgent={false}
              useTeamBrandId={false}
              onSelectAgent={handleSelectAgent}
            />
            <Box style={{ textAlign: "right" }}>
              <Button
                onClick={handleClickCancelAddButton}
                style={{
                  color: "black !important",
                  border: "solid #dbdbdb 1px",
                  borderRadius: 5,
                }}
              >
                Cancel
              </Button>
            </Box>
            <Grid container spacing={2} style={{ paddingBottom: 30 }}>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <label style={{ fontWeight: 300 }}>
                  Total: <strong>{totalPercent}%</strong>
                </label>
              </Grid>
              <Grid item xs={4} style={{ paddingLeft: 0 }}>
                <label style={{ fontWeight: 300 }}>
                  Total: <strong>${totalValue}</strong>
                </label>
              </Grid>
            </Grid>
          </>
        )}
        {showReason && (
          <>
            <Box>
              <label style={{ float: "right", marginTop: 40 }}>
                Please select your reason.
              </label>
            </Box>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={_reasonValue}
              label="Seller"
              MenuProps={{ autoFocus: false }}
              onChange={handleSelectReason}
              style={{ width: "100%" }}
            >
              <MenuItem value={-1}>Select...</MenuItem>
              <MenuItem value={0}>Approved Commission Reduction</MenuItem>
              <MenuItem value={1}>Co-broke Commission Offered</MenuItem>
              <MenuItem value={2}>Other</MenuItem>
            </Select>
            {_reasonValue == 2 && (
              <TextField
                size="small"
                label="Reason"
                value={_reasonNote}
                style={{ width: "100%", marginTop: 10 }}
                onChange={handleChangeReasonTextField}
                placeholder="Please type your reason."
              />
            )}
          </>
        )}
        {isShowButton && status === "Listing" && (
          <Box style={{ textAlign: "right", marginTop: 10 }}>
            <Button
              variant="contained"
              onClick={handleClickNextButton}
              style={{
                marginBottom: 20,
                backgroundColor: "#0fb78d",
                color: "white",
              }}
            >
              Looks good, Next
            </Button>
          </Box>
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default GCISplitQuestion
