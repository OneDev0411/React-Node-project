import React from "@libs/react";
import { IPaidByCardProps, IRoleData } from "../../../../models/type";
import useApp from "../../../../hooks/useApp";

const PaidByCard: React.FC<IPaidByCardProps> = ({
  Ui: {
    Grid,
    TextField,
    InputAdornment,
    Box,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
  },
  saveData: { next, updateFlag },
  index,
  range,
}) => {
  const { roleData, setRoleData } = useApp();
  // state
  const [_roleData, _setRoleData] = React.useState<IRoleData>(roleData[index]);
  const [checkedAgent, setCheckedAgent] = React.useState<boolean>(false);

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    updateFlag(true);
    let value: string = e.target.value;
    if (value == "NaN" || (value + "").length > 16) {
      return;
    }
    if (range == "inside") {
      if (
        key == "inside_payment_value" &&
        _roleData.inside_payment_unit_type == 0 &&
        Number(value) > 100
      ) {
        return;
      }
    } else {
      if (
        key == "outside_payment_value" &&
        _roleData.outside_payment_unit_type == 0 &&
        Number(value) > 100
      ) {
        return;
      }
    }
    let updateValue = JSON.parse(JSON.stringify(_roleData));
    if (range == "inside") {
      if (key !== "inside_payment_note") {
        if (value !== "") {
          updateValue[key] = parseFloat(value);
        } else {
          updateValue[key] = 0;
        }
      }
      if (key == "inside_payment_note") {
        updateValue[key] = value;
      }
      if (key == "inside_payment_unit_type") {
        updateValue["inside_payment_value"] = 0;
      }
    } else {
      if (key !== "outside_payment_note") {
        if (value !== "") {
          updateValue[key] = parseFloat(value);
        } else {
          updateValue[key] = 0;
        }
      }
      if (key == "outside_payment_note") {
        updateValue[key] = value;
      }
      if (key == "outside_payment_unit_type") {
        updateValue["outside_payment_value"] = 0;
      }
    }
    _setRoleData(updateValue);
  };

  const handleCheckedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFlag(true);
    let value = e.target.checked;
    setCheckedAgent(value);
    if (range == "inside") {
      if (value)
        _setRoleData({
          ..._roleData,
          inside_payment_unit_type: 0,
          inside_payment_value: 0,
          inside_payment_calculated_from: 0,
          inside_payment_note: "",
        });
      else
        _setRoleData({
          ..._roleData,
          inside_payment_unit_type: null,
          inside_payment_value: null,
          inside_payment_calculated_from: null,
          inside_payment_note: "",
        });
    } else {
      if (value)
        _setRoleData({
          ..._roleData,
          outside_payment_unit_type: 0,
          outside_payment_value: 0,
          outside_payment_calculated_from: 0,
          outside_payment_note: "",
        });
      else
        _setRoleData({
          ..._roleData,
          outside_payment_unit_type: null,
          outside_payment_value: null,
          outside_payment_calculated_from: null,
          outside_payment_note: "",
        });
    }
  };

  React.useEffect(() => {
    if (range == "inside") {
      if (roleData[index].inside_payment_value !== null) {
        setCheckedAgent(true);
      }
    } else {
      if (roleData[index].outside_payment_value !== null) {
        setCheckedAgent(true);
      }
    }
    _setRoleData(roleData[index]);
  }, [roleData]);

  // this hook save data before next wizard
  React.useEffect(() => {
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

  return (
    <Box
      style={{
        marginBottom: 20,
        marginTop: 0,
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 4,
        padding: 10,
      }}
    >
      <Box style={{ alignSelf: "center", textAlign: "left" }}>
        <Checkbox
          size="small"
          style={{ marginBottom: 3 }}
          checked={checkedAgent}
          onChange={handleCheckedValue}
        />
        <label>{_roleData.legal_full_name}</label>
      </Box>
      <Grid container spacing={1} style={{ padding: 0 }}>
        <Grid item xs={5} style={{ display: "inherit", marginRight: 10 }}>
          <Radio
            checked={range == "inside" ? _roleData.inside_payment_unit_type == 0 : _roleData.outside_payment_unit_type == 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, range == "inside" ? "inside_payment_unit_type" : "outside_payment_unit_type")
            }
            value={0}
            name="radio-buttons"
            inputProps={{ "aria-label": "A" }}
            size="small"
            disabled={!checkedAgent}
          />
          <TextField
            size="small"
            type="text"
            value={
              range == "inside" ? (_roleData.inside_payment_unit_type == 0 ? _roleData.inside_payment_value : "") : (_roleData.outside_payment_unit_type == 0 ? _roleData.outside_payment_value : "")
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, range == "inside" ? "inside_payment_value" : "outside_payment_value")
            }
            style={{ paddingTop: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%</InputAdornment>
              ),
            }}
            disabled={
              checkedAgent && (range == "inside" ? (_roleData.inside_payment_unit_type == 0 ? false : true) : (_roleData.outside_payment_unit_type == 0 ? false : true))
            }
          />
        </Grid>
        <Grid item xs={1} style={{ alignSelf: "center" }}>
          OR
        </Grid>
        <Grid item xs={5} style={{ display: "inherit" }}>
          <Radio
            checked={range == "inside" ? _roleData.inside_payment_unit_type == 1 : _roleData.outside_payment_unit_type == 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, range == "inside" ? "inside_payment_unit_type" : "outside_payment_unit_type")
            }
            value={1}
            name="radio-buttons"
            inputProps={{ "aria-label": "B" }}
            size="small"
            disabled={!checkedAgent}
          />
          <TextField
            size="small"
            type="text"
            value={
              range == "inside" ? (_roleData.inside_payment_unit_type == 1 ? _roleData.inside_payment_value : "") : (_roleData.outside_payment_unit_type == 1 ? _roleData.outside_payment_unit_type : "")
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, range == "inside" ? "inside_payment_value" : "outside_payment_value")
            }
            style={{ paddingTop: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            disabled={
              checkedAgent && (range == "inside" ? (_roleData.inside_payment_unit_type == 1 ? false : true) : (_roleData.outside_payment_unit_type == 1 ? false : true))
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ paddingLeft: 10 }}>
        <Grid
          item
          xs={5}
          style={{ maxWidth: "max-content", alignSelf: "center", marginTop: 2 }}
        >
          Calculated from:
        </Grid>
        <Grid item xs={7}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={range == "inside" ? _roleData.inside_payment_calculated_from : _roleData.outside_payment_calculated_from}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(e, range == "inside" ? "inside_payment_calculated_from" : "outside_payment_calculated_from")
            }
          >
            <FormControlLabel
              value={0}
              style={{ marginRight: 20 }}
              control={
                <Radio
                  size="small"
                  style={{ marginBottom: 3 }}
                  disabled={!checkedAgent || (range == "inside" ? _roleData.inside_payment_unit_type == 1 : _roleData.outside_payment_unit_type == 1)}
                />
              }
              label="My GCI"
            />
            <FormControlLabel
              value={1}
              style={{ marginRight: 0 }}
              control={
                <Radio
                  size="small"
                  style={{ marginBottom: 3 }}
                  disabled={!checkedAgent || (range == "outside" ? _roleData.inside_payment_unit_type == 1 : _roleData.outside_payment_unit_type == 1)}
                />
              }
              label="My NET"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Grid container spacing={1} style={{ padding: 10, paddingTop: 0 }}>
        <Grid item xs={2}>
          <label>Notes:</label>
        </Grid>
        <Grid item xs={10}>
          <TextField
            variant="standard"
            style={{ color: "inherit", width: "100%" }}
            disabled={!checkedAgent}
            value={range == "inside" ? _roleData.inside_payment_note : _roleData.outside_payment_note}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeValue(
                e,
                range == "inside" ? "inside_payment_note" : "outside_payment_note"
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default PaidByCard;
