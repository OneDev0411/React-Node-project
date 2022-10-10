import React from "@libs/react";
import ReactUse from "@libs/react-use";
import Ui from "@libs/material-ui";
import { GCISplitStatus, IPayment, IPaymentQuestionData, IPaymentData, IPaidByData, IRoleData } from "../../../../models/type";
import { defaultPayment, paymentTypeData } from "../../../../util";
import PaidByCard from "./PaidByCard";
import useApp from "../../../../hooks/useApp";

const paymentQuestionComponent: React.FC<IPaymentQuestionData> = ({
  saveData: { updateFlag },
  range,
  dealType,
  dealId,
  components: { AgentsPicker },
}) => {
  const { useState, useEffect } = React;
  const { useDebounce } = ReactUse;
  const { Grid, Box, Button, IconButton, Select, MenuItem, ListSubheader, TextField } = Ui;

  const { insidePayments, setInsidePayments, outsidePayments, setOutsidePayments, roleData, submitted, setSubmitted } = useApp();
  
  const [defaultPayments, setDefaultPayments] = useState<IPayment[]>(defaultPayment);
  const [_payments, _setPayments] = useState<IPayment[]>([]);
  const [status, setStatus] = useState<GCISplitStatus[]>([]);
  const [tmpDePaidTo, setTmpDePaidTo] = useState<string>("");

  // this make content of select tag
  const paymentTypeElement = paymentTypeData.reduce(
    (result: any, data: IPaymentData) => {
      result.push(<ListSubheader>{data.groupName}</ListSubheader>);
      data.member.map((value: string) => {
        result.push(<MenuItem value={value}>{value}</MenuItem>);
      });
      return result;
    },
    []
  );

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: keyof IPayment,
    index: number
  ) => {
    updateFlag(true); // for Next button enable
    if (key === "de_paid_to") {
      setTmpDePaidTo(String(e.target.value));
      return;
    }
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index][key] = e.target.value;
    _setPayments(temp);
  };

  const handleClickAddAnotherPayment = () => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp.push(defaultPayments[0]);
    _setPayments(temp);
    const _status = JSON.parse(JSON.stringify(status));
    _status.push("Selecting");
    setStatus(_status);
  };

  const handleClickRemovePayment = (index: number) => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp.splice(index, 1);
    _setPayments(temp);
    const _status = JSON.parse(JSON.stringify(status));
    _status.splice(index, 1);
    setStatus(_status);
  };

  const updatePayment = (payment: IPayment, index: number) => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index] = payment;
    _setPayments(temp);
  };
  
  const handleClickSaveEditButton = (index: number) => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index]["de_paid_to"] = tmpDePaidTo;
    _setPayments(temp);
    setTmpDePaidTo("");
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Listing";
    setStatus(_status);
  };
  
  const handleClickCancelEditButton = (index: number) => {
    setTmpDePaidTo("");
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Listing";
    setStatus(_status);
  };

  const handleSelectAgent = ((agent: BrandedUser, index: number) => {
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Listing";
    setStatus(_status);
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index].de_paid_to = agent.display_name || '';
    if (agent.display_name !== "") {
      if (temp[index].de_paid_by[0]["payment_value"] === null) {
        temp[index].de_paid_by[0]["payment_unit_type"] = 0;
        temp[index].de_paid_by[0]["payment_value"] = 0;
        temp[index].de_paid_by[0]["payment_calculated_from"] = 0;
      }
    }
    else {
      temp[index].de_paid_by[0]["payment_unit_type"] = null;
      temp[index].de_paid_by[0]["payment_value"] = null;
      temp[index].de_paid_by[0]["payment_calculated_from"] = null;
    }
    _setPayments(temp);
  });
  
  const handleEditPaidTo = (index: number) => {
    if (_payments[index]["de_paid_to"]) {
      setTmpDePaidTo(_payments[index]["de_paid_to"]);
    }
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Selecting";
    setStatus(_status);
  };

  useEffect(() => {
    let _defaultPayments = JSON.parse(JSON.stringify(defaultPayments));
    _defaultPayments[0].deal = dealId;
    _defaultPayments[0].de_paid_by = [];
    _defaultPayments[0].de_payment_type = range === "inside" ? "Team Member" : "Outside Referral Broker";
    _defaultPayments[0].payment_side = range;
    roleData.map((item: IRoleData) => {
      if (
        ((dealType == "Buying" || dealType == "Both") && (item.role == "BuyerAgent" || item.role == "CoBuyerAgent" || item.role == "BuyerReferral"))
        || ((dealType == "Selling" || dealType == "Both") && (item.role == "SellerAgent" || item.role == "CoSellerAgent" || item.role == "SellerReferral"))
      ) {
        _defaultPayments[0].de_paid_by.push({
          roleId: item.role_id,
          role: item.role,
          payment_by_name: item.legal_full_name,
          payment_unit_type: null,
          payment_value: null,
          payment_calculated_from: null,
          payment_note: "",
        });
      }
    });
    setDefaultPayments(_defaultPayments);
    
    const payments: IPayment[] = (range === "inside" ? 
      (insidePayments.length ? insidePayments : _defaultPayments) : (outsidePayments.length ? outsidePayments : _defaultPayments));
    _setPayments(payments);

    const _status = status;
    payments.map((item) => {
      if (item.de_paid_to !== "")
        _status.push("Listing");
      else
        _status.push("Selecting");
    });
    setStatus(_status);
  }, []);

  useEffect(() => {
    if (defaultPayments[0].de_paid_by.length !== 0 && defaultPayments[0].de_paid_by.length === roleData.length - 1) {
      let _defaultPayments = JSON.parse(JSON.stringify(defaultPayments));
      _defaultPayments[0].de_paid_by = [];
      roleData.map((item: IRoleData) => {
        if (
          ((dealType == "Buying" || dealType == "Both") && (item.role == "BuyerAgent" || item.role == "CoBuyerAgent" || item.role == "BuyerReferral"))
          || ((dealType == "Selling" || dealType == "Both") && (item.role == "SellerAgent" || item.role == "CoSellerAgent" || item.role == "SellerReferral"))
        ) {
          _defaultPayments[0].de_paid_by.push({
            roleId: item.role_id,
            role: item.role,
            payment_by_name: item.legal_full_name,
            payment_unit_type: null,
            payment_value: null,
            payment_calculated_from: null,
            payment_note: "",
          });
          if (_payments.length > 0) {
            let temp = JSON.parse(JSON.stringify(_payments));
            _payments.map((payment: IPayment, index: number) => {
              if (payment.de_paid_by.find((paidByItem: IPaidByData) => paidByItem.roleId == item.role_id) == undefined) {
                temp[index].de_paid_by.push({
                  roleId: item.role_id,
                  role: item.role,
                  payment_by_name: item.legal_full_name,
                  payment_unit_type: null,
                  payment_value: null,
                  payment_calculated_from: null,
                  payment_note: "",
                });
              }
            });
            _setPayments(temp);
          }
        }
        setDefaultPayments(_defaultPayments);
      });

      const _status = status;
      _payments.map((item) => {
        if (item.de_paid_to !== "")
          _status.push("Listing");
        else
          _status.push("Selecting");
      });
      setStatus(_status);
    }
  }, [roleData]);

  useDebounce(
    () => {
      let temp = JSON.parse(JSON.stringify(_payments));
      if (range === "inside") {
        if (setInsidePayments !== undefined) {
          setInsidePayments(temp);
        }
      } else {
        if (setOutsidePayments !== undefined) {
          setOutsidePayments(temp);
        }
      }
      if (submitted === 1) {
        if (setSubmitted !== undefined) {
          setSubmitted(2);
        }
      }
    },
    500,
    [_payments]
  );

  return (
    <>
      {_payments.map((item, index) => 
        <Box 
          style={{
            marginBottom: 20,
            padding: 30,
            paddingTop: 25,
            paddingRight: 15,
            display: 'inline-block',
            position: 'relative', 
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: 4
          }}
        >
          {_payments.length > 1 && 
            <IconButton 
              size="small"
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 7,
                height: 5
              }}
              onClick={
                () => handleClickRemovePayment(index)
              }
            >
              x
            </IconButton>
          }
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={3}>
              <label>Payment Type</label>
            </Grid>
            <Grid item xs={9}>
              <Select
                defaultValue=""
                id="grouped-select"
                label="Grouping"
                style={{ width: "100%" }}
                value={item.de_payment_type}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  handleChangeValue(
                    e,
                    "de_payment_type",
                    index
                  )
                }
              >
                {paymentTypeElement}
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={3}>
              <label>Paid To</label>
            </Grid>
            <Grid item xs={9}>
              {status[index] === "Listing" && (
                <Box style={{ display: "flex" }}>
                  <label>{item.de_paid_to}</label>
                  <Button
                    onClick={() => handleEditPaidTo(index)}
                    style={{
                      marginLeft: "auto",
                      color: "black !important",
                      border: "solid #dbdbdb 1px",
                      borderRadius: 5,
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              )}
              {status[index] === "Selecting" && 
              <>
                {item.de_payment_type === "Team Member" && (
                  <Box>
                    <AgentsPicker
                      flattenTeams={true}
                      isPrimaryAgent={false}
                      useTeamBrandId={false}
                      onSelectAgent={(agent: BrandedUser) =>
                        handleSelectAgent(agent, index)
                      }
                    />
                    <Box style={{ marginTop: 5, textAlign: "right" }}>
                      <Button
                        onClick={() => handleClickCancelEditButton(index)}
                        style={{
                          color: "black !important",
                          border: "solid #dbdbdb 1px",
                          borderRadius: 5,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
                {item.de_payment_type !== "Team Member" && (
                  <Box>
                    <TextField
                      style={{ width: "100%" }}
                      value={tmpDePaidTo}
                      name="de_paid_to"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeValue(e, "de_paid_to", index)
                      }
                    />
                    <Box style={{ marginTop: 5, textAlign: "right" }}>
                      <Button
                        onClick={() => handleClickSaveEditButton(index)}
                        style={{
                          color: "black !important",
                          border: "solid #dbdbdb 1px",
                          borderRadius: 5,
                          marginRight: 5,
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => handleClickCancelEditButton(index)}
                        style={{
                          color: "black !important",
                          border: "solid #dbdbdb 1px",
                          borderRadius: 5,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
              }
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <label style={{ marginTop: 5 }}>Paid By</label>
            </Grid>
            <Grid item xs={9}>
              {item.de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                <PaidByCard
                  key={id}
                  payment={item}
                  paymentIndex={index}
                  updatePayment={updatePayment}
                  index={id}
                  Ui={Ui}
                  saveData={{ updateFlag }}
                />
              ))}
            </Grid>
          </Grid>
          {range == "outside" && 
            (paymentTypeData[1].member.indexOf(item.de_payment_type) >= 0 || 
              paymentTypeData[2].member.indexOf(item.de_payment_type) >= 0) && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_company", index)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_company_address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_company_address", index)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Office #"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_office}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_office", index)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cell #"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_cell}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_cell", index)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Fax#"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_fax}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_fax", index)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tax ID"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_tax_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_tax_id", index)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.de_payment_mail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "de_payment_mail", index)
                  }
                />
              </Grid>
            </Grid>
          )}
        </Box>
      )}
      <Box>
        <Button
          variant="outlined"
          onClick={handleClickAddAnotherPayment}
          style={{
            color: "black !important",
            borderColor: "#dbdbdb !important",
            paddingBottom: 2,
            paddingTop: 2,
            marginLeft: 10,
          }}
        >
          + Add another payment
        </Button>
      </Box>
    </>
  );
};
export default paymentQuestionComponent;
