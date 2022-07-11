import React from "@libs/react";
import useApp from "../../../../hooks/useApp";
import { IGCIInfoItemProps, IRoleData } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField, InputAdornment },
  saveData: { next, updateFlag },
  totalClc,
  GCIValue,
  index,
}) => {
  const { useState, useEffect } = React;
  const { roleData, setRoleData } = useApp();
  const [_roleData, _setRoleData] = useState<IRoleData>(roleData[index]);

  // this hook is save data to global state.
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

  // this hook push to state variable of component from global state
  useEffect(() => {
    _setRoleData(roleData[index]);
  }, [roleData, GCIValue]);

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    updateFlag(true);

    let value: string = e.target.value;
    if (Number(value) + "" === "NaN" || (value + "").length > 16) {
      return;
    }
    if (key == "share_percent" && Number(value) > 100) {
      return;
    }

    let updateValue = JSON.parse(JSON.stringify(_roleData));
    updateValue[key] = Number(value);

    if (key == "share_percent") {
      updateValue["share_value"] = parseFloat(
        ((Number(GCIValue) / 100) * Number(value)).toFixed(3)
      );
    }

    if (key == "share_value") {
      updateValue["share_percent"] = parseFloat(
        ((Number(value) / Number(GCIValue)) * 100).toFixed(3)
      );
    }
    _setRoleData(updateValue);
    totalClc(index, updateValue);
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    updateFlag(true);
    let value: string = e.target.value;
    let updateValue = JSON.parse(JSON.stringify(_roleData));
    updateValue[key] = value;
    _setRoleData(updateValue);
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
          type="text"
          label="Share(%)"
          defaultValue={5}
          value={_roleData.share_percent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_percent")
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          type="text"
          label="Share($)"
          value={_roleData.share_value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_value")
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">$</InputAdornment>,
          }}
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
