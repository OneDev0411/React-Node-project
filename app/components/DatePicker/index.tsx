import Ui from "@libs/material-ui";
import React from "@libs/react";
import { IDatePickerProps } from "../../models/type";
import DateImage from "../../static/icons/date.png";

export const DatePicker: React.FC<IDatePickerProps> = ({
  Picker,
  value,
  setValue,
  label,
}) => {
  const { TextField, Popover, Button, Icon } = Ui;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePickDate = (date: Date) => {
    // setAnchorEl(null);
    setValue(date);
  };

  return (
    <div style={{ width: "100%" }} className="date-picker">
      <TextField
        value={value.toDateString().substring(4)}
        label={label}
        InputProps={{
          endAdornment: (
            <img
              src={DateImage}
              onClick={(e: any) => setAnchorEl(e.currentTarget)}
              width={15}
              style={{ marginRight: 10, marginBottom: 4 }}
              className="date-icon"
            />
          ),
        }}
      />

      <Popover
        id={anchorEl ? "date-picker-popover" : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Picker onChange={handlePickDate} />
      </Popover>
    </div>
  );
};
