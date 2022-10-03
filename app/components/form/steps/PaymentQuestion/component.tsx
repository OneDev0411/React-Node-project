import React from "@libs/react";
import ReactUse from "@libs/react-use";
import Ui from "@libs/material-ui";
import { GCISplitStatus, IPayment, IPaymentQuestionData, IPaymentData, IPaidByData, IRoleData } from "../../../../models/type";
import { paymentTypeData, defaultPaymentsData } from "../../../../util";
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

  const { payments, setPayments, roleData } = useApp();

  let defaultPayments: IPayment[] = defaultPaymentsData;
  defaultPayments[0].deal = dealId;
  const [_payments, _setPayments] = useState<IPayment[]>(payments.length ? payments : defaultPayments);
  const [status, setStatus] = useState<GCISplitStatus[]>([]);

  // this make content of select tag
  const displayData = paymentTypeData.reduce(
    (result: any, data: IPaymentData) => {
      result.push(<ListSubheader>{data.groupName}</ListSubheader>);
      data.member.map((value: string) => {
        result.push(<MenuItem value={value}>{value}</MenuItem>);
      });
      return result;
    },
    []
  );

  const activePayments = range == "inside" ? _payments.filter(item => item.inside_de_payment_type != "") : _payments.filter(item => item.outside_de_payment_type != "");

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: keyof IPayment,
    index: number
  ) => {
    updateFlag(true); // for Next button enable
    let temp = JSON.parse(JSON.stringify(_payments));
    if ((key === "inside_de_payment_type" || key == "outside_de_payment_type") && e.target.value == "Team Member") {
      const _status = JSON.parse(JSON.stringify(status));
      _status[index] = "Selecting";
      setStatus(_status);
    }
    temp[index][key] = e.target.value;
    _setPayments(temp);
  };

  const handleClickAddAnotherPayment = () => {
    let temp = _payments.slice();
    if (range == "inside")
      defaultPayments[0].inside_de_payment_type = "Team Member";
    else
      defaultPayments[0].outside_de_payment_type = "Outside Referral Broker";
    temp.push(defaultPayments[0]);
    _setPayments(temp);
    const _status = JSON.parse(JSON.stringify(status));
    _status.push("Selecting");
    setStatus(_status);
  };

  const handleClickRemovePayment = (index: number) => {
    let temp = _payments.slice();
    if (range == "inside") {
      temp[index].inside_de_payment_type = "";
      if (temp[index].outside_de_payment_type == "")
        temp.splice(index, 1);
    } else {
      temp[index].outside_de_payment_type = "";
      if (temp[index].inside_de_payment_type == "")
        temp.splice(index, 1);
    }
    _setPayments(temp);
  };

  const updatePayment = (payment: IPayment, index: number) => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index] = payment;
    _setPayments(temp);
  };
  
  const handleClickCancelAddButton = (index: number) => {
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Listing";
    setStatus(_status);
  };

  const handleSelectAgent = ((agent: BrandedUser, index: number, item: IPayment) => {
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Listing";
    setStatus(_status);
    let temp = JSON.parse(JSON.stringify(_payments));
    const indexInPayments = _payments.indexOf(item);
    if (range == "inside") {
      temp[indexInPayments].inside_de_paid_to = agent.display_name || '';
    } else {
      temp[indexInPayments].outside_de_paid_to = agent.display_name || '';
    }
    if (range == "inside") {
      if (agent.display_name !== "") {
        if (temp[indexInPayments].inside_de_paid_by[0]["payment_value"] == null) {
          temp[indexInPayments].inside_de_paid_by[0]["payment_unit_type"] = 0;
          temp[indexInPayments].inside_de_paid_by[0]["payment_value"] = 0;
          temp[indexInPayments].inside_de_paid_by[0]["payment_calculated_from"] = 0;
        }
      }
      else {
        temp[indexInPayments].inside_de_paid_by[0]["payment_unit_type"] = null;
        temp[indexInPayments].inside_de_paid_by[0]["payment_value"] = null;
        temp[indexInPayments].inside_de_paid_by[0]["payment_calculated_from"] = null;
      }
    } else {
      if (agent.display_name !== "") {
        if (temp[indexInPayments].outside_de_paid_by[0]["payment_value"] == null) {
          temp[indexInPayments].outside_de_paid_by[0]["payment_unit_type"] = 0;
          temp[indexInPayments].outside_de_paid_by[0]["payment_value"] = 0;
          temp[indexInPayments].outside_de_paid_by[0]["payment_calculated_from"] = 0;
        }
      }
      else {
        temp[indexInPayments].outside_de_paid_by[0]["payment_unit_type"] = null;
        temp[indexInPayments].outside_de_paid_by[0]["payment_value"] = null;
        temp[indexInPayments].outside_de_paid_by[0]["payment_calculated_from"] = null;
      }
    }
    _setPayments(temp);
  });
  
  const handleEditPaidTo = (index: number) => {
    const _status = JSON.parse(JSON.stringify(status));
    _status[index] = "Selecting";
    setStatus(_status);
  };

  useEffect(() => {
    roleData.map((item: IRoleData) => {
      if (((dealType == "Selling" || dealType == "Both") &&
            (item.role == "SellerAgent" || item.role == "CoSellerAgent" || item.role == "SellerReferral")) 
          || 
          ((dealType == "Buying" || dealType == "Both") &&
            (item.role == "BuyerAgent" || item.role == "CoBuyerAgent" || item.role == "BuyerReferral"))) {
        if (range == "inside") {
          defaultPayments[0].inside_de_paid_by.push({
            role: item.role,
            payment_by_name: item.legal_full_name,
            payment_unit_type: null,
            payment_value: null,
            payment_calculated_from: null,
            payment_note: "",
          })
        }
        else {
          defaultPayments[0].outside_de_paid_by.push({
            role: item.role,
            payment_by_name: item.legal_full_name,
            payment_unit_type: null,
            payment_value: null,
            payment_calculated_from: null,
            payment_note: "",
          })
        }
      }
    });
    if (activePayments.length === 0) {
      let temp = JSON.parse(JSON.stringify(_payments));
      if (range == "inside") {
        temp[0].inside_de_payment_type = "Team Member";
      }
      if (range == "outside") {
        temp[0].outside_de_payment_type = "Outside Referral Broker";
      }
      _setPayments(temp);
    }
    const _status = status;
    activePayments.map((item) => {
      if (range == "inside") {
        if (item.inside_de_paid_to)
          _status.push("Listing");
        else
          _status.push("Selecting");
      } else {
        if (item.outside_de_paid_to)
          _status.push("Listing");
        else
          _status.push("Selecting");
      }
    });
    setStatus(_status);
  }, []);

  useDebounce(
    () => {
      let temp = JSON.parse(JSON.stringify(_payments));
      _payments.map(item => {
        if (item.inside_de_payment_type == "" && item.outside_de_payment_type == "") {
          temp.splice(temp.indexOf(item), 1);
        }
      });
      if (setPayments !== undefined) {
        setPayments(temp);
      }
    },
    500,
    [_payments]
  );

  return (
    <>
      {activePayments.map((item, index) => 
        <Box style={{
          marginBottom: 20,
          padding: 30,
          paddingTop: 25,
          paddingRight: 15,
          display: 'inline-block',
          position: 'relative', 
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: 4
        }}>
          {activePayments.length > 1 && <IconButton size="small" style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 5 }} onClick={() => handleClickRemovePayment(_payments.indexOf(item))}>
            x
          </IconButton>}
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
                value={
                  range == "inside"
                    ? item.inside_de_payment_type
                    : item.outside_de_payment_type
                }
                onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  handleChangeValue(
                    e,
                    range == "inside"
                      ? "inside_de_payment_type"
                      : "outside_de_payment_type",
                    _payments.indexOf(item)
                  )
                }
              >
                {displayData}
              </Select>
            </Grid>
          </Grid>
          {range == "inside" && item.inside_de_payment_type == "Team Member" &&
            <>
              <Grid container spacing={2} style={{ marginBottom: 10 }}>
                <Grid item xs={3}>
                  <label>Paid To</label>
                </Grid>
                <Grid item xs={9}>
                  {status[index] === "Listing" && (
                    <Box style={{ display: "flex" }}>
                      <label>{item.inside_de_paid_to}</label>
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
                  {status[index] === "Selecting" && (
                    <Box>
                      <AgentsPicker
                        flattenTeams={true}
                        isPrimaryAgent={false}
                        useTeamBrandId={false}
                        onSelectAgent={(agent: BrandedUser) =>
                          handleSelectAgent(agent, index, item)
                        }
                      />
                      <Box style={{ marginTop: 5, textAlign: "right" }}>
                        <Button
                          onClick={() => handleClickCancelAddButton(index)}
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
                </Grid>
              </Grid>
            </>
          }
          {range == "inside" &&
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <label style={{ marginTop: 5 }}>Paid By</label>
              </Grid>
              <Grid item xs={9}>
                {item.inside_de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                  <PaidByCard
                    key={id}
                    payment={item}
                    paymentIndex={_payments.indexOf(item)}
                    updatePayment={updatePayment}
                    index={id}
                    Ui={Ui}
                    saveData={{ updateFlag }}
                    range={range}
                  />
                ))}
              </Grid>
            </Grid>
          }
          {range == "outside" && item.outside_de_payment_type == "Team Member" &&
            <>
              <Grid container spacing={2} style={{ marginBottom: 10 }}>
                <Grid item xs={3}>
                  <label>Paid To</label>
                </Grid>
                <Grid item xs={9}>
                  {status[index] === "Listing" && (
                    <Box style={{ display: "flex" }}>
                      <label>{item.outside_de_paid_to}</label>
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
                  {status[index] === "Selecting" && (
                    <Box>
                      <AgentsPicker
                        flattenTeams={true}
                        isPrimaryAgent={false}
                        useTeamBrandId={false}
                        onSelectAgent={(agent: BrandedUser) =>
                          handleSelectAgent(agent, index, item)
                        }
                      />
                      <Box style={{ marginTop: 5, textAlign: "right" }}>
                        <Button
                          onClick={() => handleClickCancelAddButton(index)}
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
                </Grid>
              </Grid>
            </>
          }
          {range == "outside" &&
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <label style={{ marginTop: 5 }}>Paid By</label>
              </Grid>
              <Grid item xs={9}>
                {item.outside_de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                  <PaidByCard
                    key={id}
                    payment={item}
                    paymentIndex={_payments.indexOf(item)}
                    updatePayment={updatePayment}
                    index={id}
                    Ui={Ui}
                    saveData={{ updateFlag }}
                    range={range}
                  />
                ))}
              </Grid>
            </Grid>
          }
          {range == "outside" && 
            (paymentTypeData[1].member.indexOf(item.outside_de_payment_type) >= 0 || 
              paymentTypeData[2].member.indexOf(item.outside_de_payment_type) >= 0) && (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_company", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_company_address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_company_address", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Office #"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_office}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_office", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cell #"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_cell}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_cell", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Fax#"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_fax}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_fax", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tax ID"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_tax_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_tax_id", _payments.indexOf(item))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  variant="standard"
                  style={{ width: "100%" }}
                  value={item.outside_de_payment_mail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeValue(e, "outside_de_payment_mail", _payments.indexOf(item))
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
