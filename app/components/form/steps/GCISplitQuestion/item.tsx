import React from "@libs/react";
import useApp from "../../../../hooks/useApp";
import { IGCIInfoItemProps, IRoleData } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  saveData: { next, updateFlag },
  totalClc,
  salesPrice,
  index,
}) => {
  const { useState, useEffect } = React;
  const { roleData, setRoleData } = useApp();
  const [_roleData, _setRoleData] = useState<IRoleData>(roleData[index]);

  // this hook save data to global state.
  useEffect(() => {
    if (next) {
      let dataIndex = roleData.findIndex((item) => {
        return item.role_id == _roleData.role_id;
      });
      roleData[dataIndex] = _roleData;
      let temp = JSON.parse(JSON.stringify(roleData));
      if (setRoleData !== undefined) {
        setRoleData(temp);
      }
    }
  }, [next]);

  // this hook pull data from global state to state variable of component
  useEffect(() => {
    const temp = roleData[index];
    temp.share_value =
          temp.share_value == null
            ? parseFloat((Number(salesPrice) * Number(temp.share_percent) / 100).toFixed(3))
            : temp.share_value;
    temp.share_percent =
          temp.share_percent == null
            ? parseFloat((Number(temp.share_value) / Number(salesPrice) * 100).toFixed(3))
            : temp.share_percent;
    _setRoleData(temp);
  }, [roleData]);

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    let value: string = e.target.value;
    if (Number(value) + "" === "NaN" || (value + "").length > 16) {
      return;
    }
    if (key == "share_percent" && Number(value) > 100) {
      return;
    }
    if (value !== roleData[index][key])
      updateFlag(true);
    else
      updateFlag(false);
    let updateValue = JSON.parse(JSON.stringify(_roleData));
    updateValue[key] = Number(value);

    if (key == "share_percent") {
      updateValue["share_value"] = parseFloat(
        ((Number(salesPrice) / 100) * Number(value)).toFixed(3)
      );
    }
    if (key == "share_value") {
      updateValue["share_percent"] = parseFloat(
        ((Number(value) / Number(salesPrice)) * 100).toFixed(3)
      );
    }

    _setRoleData(updateValue);
    totalClc(index, updateValue, true);
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    let value: string = e.target.value;
    if (value !== roleData[index][key])
      updateFlag(true);
    else
      updateFlag(false);
    let updateValue = JSON.parse(JSON.stringify(_roleData));
    updateValue[key] = value;
    _setRoleData(updateValue);
    totalClc(index, updateValue, false);
  };

  return (
    <Grid container spacing={2} style={{ paddingBottom: 10 }}>
      <Grid item xs={4}>
        <Box>
          <label style={{ fontSize: 13, marginTop: 11 }}>
            {_roleData.legal_full_name}
          </label>
        </Box>
        <Box>
          <label style={{ fontSize: 13, color: "#ababab" }}>
            {_roleData.role}
          </label>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          type="number"
          label="Share(%)"
          defaultValue={5}
          value={Number(_roleData.share_percent)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_percent")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          type="number"
          label="Share($)"
          value={Number(_roleData.share_value)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_value")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4} style={{ marginTop: -10 }} />
      <Grid item xs={8} style={{ marginTop: -10 }}>
        <TextField
          type="text"
          label="Note"
          value={_roleData.note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeText(e, "note")
          }
          style={{ width: "100%", marginTop: -15, marginBottom: 20 }}
        />
      </Grid>
    </Grid>
  );
};

export default GCIInfoItem;
