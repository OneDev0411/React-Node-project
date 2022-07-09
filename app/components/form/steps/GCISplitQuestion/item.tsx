import React from "@libs/react";
import useApp from "../../../../hooks/useApp";
import { IGCIInfoItemProps, IRoleData } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  GCIValue,
  index,
  next,
  updateFlag,
}) => {
  const { useState, useEffect } = React;
  const { roleData, setRoleData } = useApp();
  const [_roleData, _setRoleData] = useState<IRoleData>(roleData[index]);

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

  useEffect(() => {
    _setRoleData({
      ...roleData[index],
      share_value: parseFloat(
        (
          (Number(GCIValue) / 100) *
          Number(roleData[index].share_percent)
        ).toFixed(3)
      ),
    });
  }, [roleData, GCIValue]);

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    updateFlag(true);

    if (key == "share_percent" && Number(e.target.value) > 100) {
      return;
    }

    let value: string = e.target.value;
    let updateValue = JSON.parse(JSON.stringify(_roleData));

    if (key == "note") {
      updateValue[key] = value;
    } else {
      updateValue[key] = Number(value);
    }

    if (key == "share_percent") {
      if (value !== "") {
        updateValue["share_value"] = parseFloat(
          ((Number(GCIValue) / 100) * Number(value)).toFixed(3)
        );
      } else {
        updateValue["share_value"] = 0;
      }
    }

    if (key == "share_value") {
      if (value !== "") {
        updateValue["share_percent"] = parseFloat(
          ((Number(value) / Number(GCIValue)) * 100).toFixed(3)
        );
      } else {
        updateValue["share_percent"] = 0;
      }
    }
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
          required
          size="small"
          label="Share(%)"
          defaultValue={5}
          value={_roleData.share_percent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeValue(e, "share_percent")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          required
          size="small"
          label="Share($)"
          value={_roleData.share_value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeValue(e, "share_value")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4} style={{ marginTop: -10 }} />
      <Grid item xs={8} style={{ marginTop: -10 }}>
        <TextField
          id={`GCI-item-textfield-${index}`}
          size="small"
          label="Note"
          value={_roleData.note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeValue(e, "note")
          }
          style={{ width: "100%", marginTop: -15, marginBottom: 20 }}
        />
      </Grid>
    </Grid>
  );
};

export default GCIInfoItem;
