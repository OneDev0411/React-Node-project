import React from "@libs/react";
import Ui from "@libs/material-ui";
import {
  GCISplitStatus,
  IQuestionProps,
  IRoleData,
} from "../../../../models/type";
import GCIInfoItem from "./item";
import useApp from "../../../../hooks/useApp";
import { stylizeNumber } from "../../../../util";

const GCISplitQuestion: React.FC<IQuestionProps> = ({
  Wizard: { QuestionSection, QuestionTitle, QuestionForm },
  hooks: { useWizardContext },
  models: { deal, roles },
  Components: { RoleForm, ContactRoles },
  api: { deleteRole },
}) => {
  const { useState, useEffect } = React;
  const { Grid, Button, Box, TextField, Select, MenuItem } = Ui;
  const wizard = useWizardContext();
  const { dealData, setDealData, roleData, setRoleData, submitted } = useApp();

  // state
  const [_roleData, _setRoleData] = useState<IRoleData[]>(roleData);
  const [status, setStatus] = useState<GCISplitStatus>("Listing");
  const [currentRole, setCurrentObject] = useState<
    Partial<IDealFormRole> | IDealRole | null
  >(null); // data from dropdown select, can be IDealRole object or nameObject
  const [showButton, setShowButton] = useState<boolean>(true);
  const [next, setNext] = useState<boolean>(false);
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
    if (setDealData !== undefined) {
      dealData.gci_de_value = salesPrice * totalPercent / 100;
      let temp = JSON.parse(JSON.stringify(dealData));
      setDealData(temp);
    }
    if (
      (totalPercent < 2 && !bothType) ||
      (totalPercent < 4 && bothType)
    ) {
      dealData.gci_reason_select = _reasonValue;
      let temp = JSON.parse(JSON.stringify(dealData));
      if (setDealData !== undefined) {
        setDealData(temp);
      }
      if (_reasonValue === 2) {
        dealData.gci_reason = _reasonNote;
        let temp = JSON.parse(JSON.stringify(dealData));
        if (setDealData !== undefined) {
          setDealData(temp);
        }
      }
    }
    setNext(true);
    setTimeout(() => {
      wizard.next();
      setNext(false);
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
    let isPrimary = isPrimaryAgent(data.role);
    if (isPrimary) {
      return;
    }
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
    if (!showButton) {
      setShowButton(flag);
    }
  };

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
    if (submitted === 1)
      setShowButton(false);
    else
      setShowButton(true);
  }, []);
  
  useEffect(() => {
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
  }, [_roleData]);

  useEffect(() => {
    _setRoleData(roleData);
  }, [roleData]);

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
                saveData={{ next, updateFlag }}
                totalClc={totalClc}
              />
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
                saveData={{ next, updateFlag }}
                totalClc={totalClc}
              />
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
              onClose={handleCloseRoleForm}
              title=" "
              form={
                currentRole === null
                  ? { role: "BuyerAgent" }
                  : { ...currentRole, role: "BuyerAgent" }
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
