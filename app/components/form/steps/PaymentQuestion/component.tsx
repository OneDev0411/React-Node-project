import React from "@libs/react";
import ReactUse from "@libs/react-use";
import Ui from "@libs/material-ui";
import { IPayment, IPaymentQuestionData, IPaymentData, IPaidByData, IRoleData } from "../../../../models/type";
import { paymentTypeData, defaultPaymentsData } from "../../../../util";
import PaidByCard from "./PaidByCard";
import useApp from "../../../../hooks/useApp";

const paymentQuestionComponent: React.FC<IPaymentQuestionData> = ({
  saveData: { updateFlag },
  range,
  dealType,
  dealId
}) => {
  const { useState, useEffect } = React;
  const { useDebounce } = ReactUse;
  const { Grid, Box, Button, IconButton, Select, MenuItem, ListSubheader, TextField } = Ui;

  const { payments, setPayments, roleData } = useApp();

  let defaultPayments: IPayment[] = defaultPaymentsData;
  defaultPayments[0].deal = dealId;
  const [_payments, _setPayments] = useState<IPayment[]>(payments.length ? payments : defaultPayments);

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

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: keyof IPayment,
    index: number
  ) => {
    updateFlag(true); // for Next button enable
    let temp = JSON.parse(JSON.stringify(_payments));
    if (key === "inside_de_paid_to") {
      if (e.target.value !== "") {
        if (temp[index].inside_de_paid_by[0]["payment_value"] == null) {
          temp[index].inside_de_paid_by[0]["payment_unit_type"] = 0;
          temp[index].inside_de_paid_by[0]["payment_value"] = 0;
          temp[index].inside_de_paid_by[0]["payment_calculated_from"] = 0;
        }
      }
      else {
        temp[index].inside_de_paid_by[0]["payment_unit_type"] = null;
        temp[index].inside_de_paid_by[0]["payment_value"] = null;
        temp[index].inside_de_paid_by[0]["payment_calculated_from"] = null;
      }
    }
    if (key === "outside_de_paid_to") {
      if (e.target.value !== "") {
        if (temp[index].outside_de_paid_by[0]["payment_value"] == null) {
          temp[index].outside_de_paid_by[0]["payment_unit_type"] = 0;
          temp[index].outside_de_paid_by[0]["payment_value"] = 0;
          temp[index].outside_de_paid_by[0]["payment_calculated_from"] = 0;
        }
      }
      else {
        temp[index].outside_de_paid_by[0]["payment_unit_type"] = null;
        temp[index].outside_de_paid_by[0]["payment_value"] = null;
        temp[index].outside_de_paid_by[0]["payment_calculated_from"] = null;
      }
    }
    temp[index][key] = e.target.value;
    _setPayments(temp);
  };

  const handleClickAddAnotherPayment = (event: any) => {
    let temp = _payments.slice();
    if (range == "inside")
      defaultPayments[0].inside_de_payment_type = "Team Member";
    else
      defaultPayments[0].outside_de_payment_type = "Outside Referral Broker";
    temp.push(defaultPayments[0]);
    console.log(temp);
    _setPayments(temp);
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
  }

  const updatePayment = (payment: IPayment, index: number) => {
    let temp = JSON.parse(JSON.stringify(_payments));
    temp[index] = payment;
    _setPayments(temp);
  }

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
    if (_payments.length == 1) {
      if (_payments[0].inside_de_payment_type == "") {
        let temp = JSON.parse(JSON.stringify(_payments));
        temp[0].inside_de_payment_type = "Team Member";
        _setPayments(temp);
      }
      if (_payments[0].outside_de_payment_type == "") {
        let temp = JSON.parse(JSON.stringify(_payments));
        temp[0].outside_de_payment_type = "Outside Referral Broker";
        _setPayments(temp);
      }
    }
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
      {_payments.filter(item => {
        if (range == "inside")
          return item.inside_de_payment_type != ""
        else
          return item.outside_de_payment_type != ""
      }).map((item, index) => 
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
          {_payments.filter(item => {
              if (range == "inside")
                return item.inside_de_payment_type != ""
              else
                return item.outside_de_payment_type != ""
            }).length > 1 && <IconButton size="small" style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 5 }} onClick={() => handleClickRemovePayment(_payments.indexOf(item))}>
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
          <Grid container spacing={2} style={{ marginBottom: 10 }}>
            <Grid item xs={3}>
              <label>Paid To</label>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="standard"
                style={{ width: "100%" }}
                defaultValue="Preston Maguire (575 Madison Ave)"
                value={
                  range == "inside"
                    ? item.inside_de_paid_to
                    : item.outside_de_paid_to
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeValue(
                    e,
                    range == "inside" ? "inside_de_paid_to" : "outside_de_paid_to",
                    _payments.indexOf(item)
                  )
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <label style={{ marginTop: 5 }}>Paid By</label>
            </Grid>
            <Grid item xs={9}>
              {range == "inside" && item.inside_de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                <PaidByCard
                  key={id}
                  payment={item}
                  paymentIndex={index}
                  updatePayment={updatePayment}
                  index={id}
                  Ui={Ui}
                  saveData={{ updateFlag }}
                  range={range}
                />
              ))}
              {range == "outside" && item.outside_de_paid_by.map((paidByItem: IPaidByData, id: number) => (
                <PaidByCard
                  key={id}
                  payment={item}
                  paymentIndex={index}
                  updatePayment={updatePayment}
                  index={id}
                  Ui={Ui}
                  saveData={{ updateFlag }}
                  range={range}
                />
              ))}
            </Grid>
          </Grid>
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
