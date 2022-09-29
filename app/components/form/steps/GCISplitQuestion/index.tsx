import React from "@libs/react";
import ReactUse from "@libs/react-use";
import Ui from "@libs/material-ui";
import {
  GCISplitStatus,
  IQuestionProps,
  IRoleData,
} from "../../../../models/type";
import GCIInfoItem from "./item";
import useApp from "../../../../hooks/useApp";

const GCISplitQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext, useSectionContext },
  models: { deal, roles },
  Components: { RoleForm, ContactRoles },
  api: { deleteRole },
}) => {
  const { useState, useEffect } = React;
  const { useDebounce } = ReactUse;
  const { Grid, Button, Box, TextField, Select, MenuItem } = Ui;
  const wizard = useWizardContext();
  const { step } = useSectionContext();
  const { dealData, setDealData, roleData, setRoleData, submitted, currentStep, setCurrentStep } = useApp();
  
  // state
  const [_roleData, _setRoleData] = useState<IRoleData[]>(roleData);
  const [status, setStatus] = useState<GCISplitStatus>("Listing");
  const [currentRole, setCurrentObject] = useState<
    Partial<IDealFormRole> | IDealRole | null
  >(null); // data from dropdown select, can be IDealRole object or nameObject
  const [showButton, setShowButton] = useState<boolean>(true);
  const [totalPercent, setTotalPercent] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [_reasonValue, _setReasonValue] = useState<number>(
    dealData.gci_reason_select
  );
  const [_reasonNote, _setReasonNote] = useState<string>("");

  // constants
  const salesPrice = deal.context.sales_price?.number;
  const dealType = deal.deal_type;
  const enderType = deal.context.ender_type?.text;
  const bothType = (enderType === "AgentDoubleEnder" || enderType === "OfficeDoubleEnder") ? true : false;

  const showReason =
    bothType ? totalPercent < 4 : totalPercent < 2;

  const notFinishCase1 = showReason && _reasonValue === -1; // not selected reason
  const notFinishCase2 = showReason && _reasonValue === 2 && _reasonNote === ""; // not completed reason note
  const isShowButton = showButton && !(notFinishCase1 || notFinishCase2);

  const handleChangeReasonTextField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    _setReasonNote(event.target.value);
  };

  const handleSelectReason = (event: React.ChangeEvent<{ value: unknown }>) => {
    _setReasonValue(Number(event.target.value));
  };

  const handleUpsertRole = (agentRole: IDealRole) => {
    const { id, legal_full_name, role, commission_percentage, commission_dollar } = agentRole;
    const roleDt: IRoleData = {
      deal: deal.id,
      role_id: id,
      legal_full_name: legal_full_name,
      role: role,
      share_percent: commission_percentage ? commission_percentage : parseFloat(((Number(commission_dollar) / salesPrice) * 100).toFixed(3)),
      share_value: commission_dollar ? commission_dollar : parseFloat(((salesPrice / 100) * Number(commission_percentage)).toFixed(3)),
      note: "",
    };
    const _role = JSON.parse(JSON.stringify(_roleData));
    _role.push(roleDt);
    _setRoleData(_role);
    totalClc(_role.length, roleDt, true);
  }

  // this logic is updating
  const handleCloseRoleForm = () => {
    // in case of no match role, ignore cancel action
    setStatus("Listing");
    setCurrentObject(null);
  };

  const handleSelectContact = (contact: Partial<IDealFormRole>) => {
    setCurrentObject(contact);
    setStatus("Inserting");
  };

  const handleClickAddAnotherButton = () => {
    setStatus("Selecting");
  };

  const handleClickNextButton = async () => {
    setShowButton(false);
    let temp = JSON.parse(JSON.stringify(dealData));
    temp.current_step = step + 1;
    if (setDealData !== undefined)
      setDealData(temp);
    setTimeout(() => {
      if (wizard.currentStep < step + 1) {
        wizard.next();
        if (setCurrentStep !== undefined) {
          setCurrentStep(step+1);
        }
      }
    }, 80);
  };

  const handleClickCancelAddButton = () => {
    setStatus("Listing");
  };

  const isPrimaryAgent = (role: IRoleData["role"]) => {
    return (
      (role === "BuyerAgent" && dealType === "Buying") ||
      (role === "SellerAgent" && dealType === "Selling")
    );
  };

  const handleClickRemoveButton = async (data: IRoleData, index: number) => {
    let roleModel = roles.find((role: IDealRole) => {
      return data.role_id == role.id;
    });
    if (roleModel !== undefined) {
      await deleteRole(roleModel);
    }

    // for display deleting result
    let temp: IRoleData[] = _roleData.slice();
    temp.splice(index, 1);
    if (setRoleData !== undefined) {
      setRoleData(temp);
    }
  };

  const updateFlag = (flag: boolean) => {
    if (submitted != 1 && wizard.currentStep < step + 1) {
      setShowButton(flag);
    }
  };

  // calculate total percent and value when roleData is changed
  const totalClc = (index: number, data: IRoleData, clcFlag: boolean) => {
    let temp = JSON.parse(JSON.stringify(_roleData));
    temp[index] = data;
    if (clcFlag) {
      let tempValue = temp.filter((item: IRoleData) => bothType ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: number, data: IRoleData) => {
        return parseFloat(
          (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
        );
      }, 0);
      setTotalPercent(tempValue);
      tempValue = temp.filter((item: IRoleData) => bothType ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: number, data: IRoleData) => {
        return parseFloat(
          (Number(totalValue) + Number(data.share_value)).toFixed(3)
        );
      }, 0);
      setTotalValue(tempValue);
    }
    _setRoleData(temp);
  };

  useEffect(() => {
    if (submitted === 1 || currentStep > step)
      setShowButton(false);
    else
      setShowButton(true);

    // calculate total percent and value when mounted
    let tempClc = _roleData.filter((item: IRoleData) => bothType ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalPercent: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
      );
    }, 0);
    setTotalPercent(tempClc);
    tempClc = _roleData.filter((item: IRoleData) => bothType ? item.role !== null : item.role.indexOf(dealType === "Buying" ? "Buyer" : "Seller") >= 0).reduce((totalValue: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalValue) + Number(data.share_value)).toFixed(3)
      );
    }, 0);
    setTotalValue(tempClc);
  }, []);
  
  // save data to global state 0.5s after data is inputed
  useDebounce(
    () => {
      let temp = JSON.parse(JSON.stringify(dealData));
      temp.gci_de_value = salesPrice * totalPercent / 100;
      if (
        (totalPercent < 2 && !bothType) ||
        (totalPercent < 4 && bothType)
      ) {
        temp.gci_reason_select = _reasonValue;
        if (_reasonValue === 2) {
          temp.gci_reason = _reasonNote;
        }
      }
      if (setDealData !== undefined) {
        setDealData(temp);
      }
      if (setRoleData !== undefined) {
        setRoleData(_roleData);
      }
    },
    500,
    [_roleData]
  );

  return (
    <QuestionSection>
      <QuestionTitle>
        Great, here is your GCI share before splits:
      </QuestionTitle>
      <QuestionForm>
        {_roleData.map((item: IRoleData, id: number) => (
          <>
            {(dealType === "Buying" || bothType) && 
              (item.role == "BuyerAgent" ||
                item.role == "CoBuyerAgent" ||
                item.role == "BuyerReferral") && <>
              <GCIInfoItem
                Ui={Ui}
                key={id}
                index={id}
                salesPrice={salesPrice}
                saveData={{ updateFlag }}
                totalClc={totalClc}
                role={item}
              />
              {_roleData.length > 1 && isPrimaryAgent(item.role) != true &&
                <Button
                  key={id}
                  variant="outlined"
                  onClick={() => handleClickRemoveButton(item, id)}
                  style={{
                    color: "black !important",
                    borderColor: "#dbdbdb !important",
                    paddingBottom: 2,
                    paddingTop: 2,
                    marginLeft: 10,
                    marginBottom: 20,
                    marginTop: -20,
                    float: "right",
                  }}
                >
                  Remove one
                </Button>
              }
            </>}
            {(dealType == "Selling" || bothType) && 
              (item.role == "SellerAgent" ||
                item.role == "CoSellerAgent" ||
                item.role == "SellerReferral") && <>
              <GCIInfoItem
                Ui={Ui}
                key={id}
                index={id}
                salesPrice={salesPrice}
                saveData={{ updateFlag }}
                totalClc={totalClc}
                role={item}
              />
              {_roleData.length > 1 && isPrimaryAgent(item.role) != true &&
                <Button
                  key={id}
                  variant="outlined"
                  onClick={() => handleClickRemoveButton(item, id)}
                  style={{
                    color: "black !important",
                    borderColor: "#dbdbdb !important",
                    paddingBottom: 2,
                    paddingTop: 2,
                    marginLeft: 10,
                    marginBottom: 20,
                    marginTop: -20,
                    float: "right",
                  }}
                >
                  Remove one
                </Button>
              }
            </>}
          </>
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
                marginLeft: -10,
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
                currentRole === null
                  ? (dealType == "Selling" ? { role: "SellerAgent" } : { role: "BuyerAgent" })
                  : (dealType == "Selling" ? { ...currentRole, role: "SellerAgent" } : { ...currentRole, role: "BuyerAgent" })
              }
            />
          </Box>
        )}
        {status === "Selecting" && (
          <>
            <ContactRoles
              placeholder={`Enter agent's name`}
              onSelectRole={handleSelectContact}
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
            <Box id="select-reason-box">
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
  );
};

export default GCISplitQuestion;
