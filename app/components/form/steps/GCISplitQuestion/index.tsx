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
  const { Grid, Button, Box } = Ui;
  const wizard = useWizardContext();
  const { dealData, roleData, setRoleData, submitted } = useApp();

  // state
  const [_roleData, _setRoleData] = useState<IRoleData[]>(roleData);
  const [status, setStatus] = useState<GCISplitStatus>("Listing");
  const [currentRole, setCurrentObject] = useState<
    Partial<IDealFormRole> | IDealRole | null
  >(null); // data from dropdown select, can be IDealRole object or nameObject
  const [showButton, setShowButton] = useState<boolean>(true);
  const [next, setNext] = useState<boolean>(false);
  const [totalPercent, setTotalPercent] = useState<number>(0);

  // constants
  const dealType = deal.deal_type;
  const listPrice = deal.context.list_price?.number;

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
      let tempValue = temp.reduce((totalPercent: number, data: IRoleData) => {
        return parseFloat(
          (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
        );
      }, 0);
      setTotalPercent(tempValue);
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
    let tempClc = _roleData.reduce((totalPercent: any, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
      );
    }, 0);
    setTotalPercent(tempClc);
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
            <GCIInfoItem
              Ui={Ui}
              key={id}
              index={id}
              GCIValue={listPrice}
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
                  Total:{" "}
                  <strong>
                    $
                    {stylizeNumber(
                      (listPrice / 100) * totalPercent
                    )}
                  </strong>
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
                  Total:{" "}
                  <strong>
                    $
                    {stylizeNumber(
                      (Number(dealData.gci_de_value) / 100) * totalPercent
                    )}
                  </strong>
                </label>
              </Grid>
            </Grid>
          </>
        )}
        {showButton && status === "Listing" && (
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
