import React from "@libs/react";
import Ui from "@libs/material-ui";
import { IDealData, IPaymentQuestionData } from "../../../../models/type";
import { IPaymentData, IRoleData } from "../../../../models/type";
import { paymentTypeData } from "../../../../util";
import PaidByCard from "./PaidByCard";
import useApp from "../../../../hooks/useApp";

const paymentQuestionComponent: React.FC<IPaymentQuestionData> = ({
  saveData: { next, updateFlag },
  range,
  deal_type,
}) => {
  const { useState, useEffect } = React;
  const { Grid, Select, MenuItem, ListSubheader, TextField } = Ui;

  const { dealData, setDealData, roleData } = useApp();
  const [_dealData, _setDealData] = useState<IDealData>(dealData);

  // this make content of select tag
  const displayData = paymentTypeData.reduce(
    (result: any, data: IPaymentData) => {
      result.push(<ListSubheader>{data.groupName}</ListSubheader>);
      data.member.map((value: string, index: number) => {
        result.push(<MenuItem value={value}>{value}</MenuItem>);
      });
      return result;
    },
    []
  );

  const handleChangeValue = (
    e: React.ChangeEvent<{ value: unknown }>,
    key: keyof IDealData
  ) => {
    updateFlag(true); // for Next button enable
    let temp = JSON.parse(JSON.stringify(_dealData));
    temp[key] = e.target.value;
    _setDealData(temp);
  };

  // this hook save data before next wizard
  useEffect(() => {
    // save data
    if (next) {
      if (setDealData !== undefined) {
        setDealData(_dealData);
      }
    }
  }, [next]);

  useEffect(() => {
    _setDealData(dealData);
  }, [dealData]);

  return (
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
                ? _dealData.inside_de_payment_type
                : _dealData.outside_de_payment_type
            }
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              handleChangeValue(
                e,
                range == "inside"
                  ? "inside_de_payment_type"
                  : "outside_de_payment_type"
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
                ? _dealData.inside_de_paid_to
                : _dealData.outside_de_paid_to
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(
                e,
                range == "inside" ? "inside_de_paid_to" : "outside_de_paid_to"
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
          {roleData.map((agent: IRoleData, id: number) => (
            <>
              {range == "inside" &&
                deal_type == "Selling" &&
                (agent.role == "BuyerAgent" ||
                  agent.role == "CoBuyerAgent") && (
                  <PaidByCard
                    key={id}
                    index={id}
                    Ui={Ui}
                    saveData={{ next, updateFlag }}
                  />
                )}
              {range == "outside" &&
                deal_type == "Selling" &&
                (agent.role == "SellerAgent" ||
                  agent.role == "CoSellerAgent") && (
                  <PaidByCard
                    key={id}
                    index={id}
                    Ui={Ui}
                    saveData={{ next, updateFlag }}
                  />
                )}
              {range == "inside" &&
                deal_type == "Buying" &&
                (agent.role == "SellerAgent" ||
                  agent.role == "CoSellerAgent") && (
                  <PaidByCard
                    key={id}
                    index={id}
                    Ui={Ui}
                    saveData={{ next, updateFlag }}
                  />
                )}
              {range == "outside" &&
                deal_type == "Buying" &&
                (agent.role == "BuyerAgent" ||
                  agent.role == "CoBuyerAgent") && (
                  <PaidByCard
                    key={id}
                    index={id}
                    Ui={Ui}
                    saveData={{ next, updateFlag }}
                  />
                )}
              {range == "outside" &&
                deal_type == "Both" &&
                (agent.role == "BuyerAgent" ||
                  agent.role == "CoBuyerAgent" ||
                  agent.role == "SellerAgent" ||
                  agent.role == "CoSellerAgent") && (
                  <PaidByCard
                    key={id}
                    index={id}
                    Ui={Ui}
                    saveData={{ next, updateFlag }}
                  />
                )}
            </>
          ))}
        </Grid>
      </Grid>
      {range == "outside" && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              label="Company"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_company")
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company Address"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_company_address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_company_address")
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Office #"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_office}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_office")
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Cell #"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_cell}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_cell")
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Fax#"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_fax}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_fax")
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tax ID"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_tax_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_tax_id")
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="standard"
              style={{ width: "100%" }}
              value={_dealData.outside_de_payment_mail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeValue(e, "outside_de_payment_mail")
              }
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default paymentQuestionComponent;
