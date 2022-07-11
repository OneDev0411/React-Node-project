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
  const { dealData, roleData, setRoleData } = useApp();

  // state
  const [status, setStatus] = useState<GCISplitStatus>("Listing");
  const [currentRole, setCurrentObject] = useState<
    Partial<IDealFormRole> | IDealRole | null
  >(null); // data from dropdown select, can be IDealRole object or nameObject
  const [showButton, setShowButton] = useState<boolean>(true);
  const [next, setNext] = useState<boolean>(false);
  const [totalPercent, setTotalPercent] = useState<number>(0);

  // constants
  const dealType = deal.deal_type;

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
    console.log("roleModel", roleModel);
    if (roleModel !== undefined) {
      await deleteRole(roleModel);
    }

    // for display deleting result
    let temp: IRoleData[] = roleData.slice();
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

  const totalClc = (index: number, data: IRoleData) => {
    let temp = JSON.parse(JSON.stringify(roleData));
    temp[index] = data;
    let tempValue = temp.reduce((totalPercent: number, data: IRoleData) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
      );
    }, 0);
    setTotalPercent(tempValue);
  };

  useEffect(() => {
    let tempClc = roleData.reduce((totalPercent: any, data: any) => {
      return parseFloat(
        (Number(totalPercent) + Number(data.share_percent)).toFixed(3)
      );
    }, 0);
    setTotalPercent(tempClc);
  }, [roleData]);

  return (
    <QuestionSection>
      <QuestionTitle>
        Great, here is your GCI share before splits:
      </QuestionTitle>
      <QuestionForm>
        {roleData.map((item: IRoleData, id: number) => (
          <>
            <GCIInfoItem
              Ui={Ui}
              key={id}
              index={id}
              GCIValue={dealData.gci_de_value}
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
                      (Number(dealData.gci_de_value) / 100) * totalPercent
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
