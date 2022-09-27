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
  const { Grid, Box, Button, Select, MenuItem, ListSubheader, TextField } = Ui;

  const { payments, setPayments, dealData, setDealData, roleData } = useApp();

  let defaultPayments: IPayment[] = defaultPaymentsData;
  defaultPayments[0].deal = dealId;
  const [_payments, _setPayments] = useState<IPayment[]>(defaultPayments);

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
    temp.push(defaultPayments[0]);
    _setPayments(temp);
  };

  const handleClickRemovePayment = (event: any) => {
    let temp = _payments.slice();
    temp.pop();
    _setPayments(temp);
  };

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
  }, []);

  useEffect(() => {
    if (payments.length)
      _setPayments(payments);
  }, [payments]);

  useDebounce(
    () => {
      if (setPayments !== undefined) {
        setPayments(_payments);
      }
    },
    500,
    [_payments]
  );

  return (
    <>
      {_payments.map((item, index) => 
      <>
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
                  index
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
                  index
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
          <Grid container spacing={1} style={{ marginBottom: "30px" }}>
            <Grid item xs={12}>
              <TextField
                label="Company"
                variant="standard"
                style={{ width: "100%" }}
                value={item.outside_de_payment_company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeValue(e, "outside_de_payment_company", index)
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
                  handleChangeValue(e, "outside_de_payment_company_address", index)
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
                  handleChangeValue(e, "outside_de_payment_office", index)
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
                  handleChangeValue(e, "outside_de_payment_cell", index)
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
                  handleChangeValue(e, "outside_de_payment_fax", index)
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
                  handleChangeValue(e, "outside_de_payment_tax_id", index)
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
                  handleChangeValue(e, "outside_de_payment_mail", index)
                }
              />
            </Grid>
          </Grid>
        )}
      </>)}
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
        {_payments.length > 1 && (
          <Button
            variant="outlined"
            onClick={handleClickRemovePayment}
            style={{
              color: "black !important",
              borderColor: "#dbdbdb !important",
              paddingBottom: 2,
              paddingTop: 2,
              marginLeft: 10,
            }}
          >
            Remove one
          </Button>
        )}
      </Box>
    </>
  );
};
export default paymentQuestionComponent;
