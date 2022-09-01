import React from "@libs/react";
import { IPaidByInfoCardProps, IRoleData } from "../../../../models/type";
import useApp from "../../../../hooks/useApp";

const PaidByInfoCard: React.FC<IPaidByInfoCardProps> = ({
  Ui: {
    Grid,
  },
  index,
  range,
}) => {
  const { roleData } = useApp();
  // state
  const _roleData: IRoleData = roleData[index];

  return (
    <Grid container style={{ marginTop: "15px" }}>
      <Grid item xs={12}>
        {_roleData.legal_full_name}
      </Grid>
      <Grid item xs={12}>
        {
          range == "inside" ? 
            (_roleData.inside_payment_unit_type == 0 ? `${_roleData.inside_payment_value}%` : `$${_roleData.inside_payment_value}`) :
            (_roleData.outside_payment_unit_type == 0 ? `${_roleData.outside_payment_value}%` : `$${_roleData.outside_payment_value}`)
        }
      </Grid>
      <Grid item xs={12}>
        Calculated from: <label>{range == "inside" ? (_roleData.inside_payment_calculated_from == 0 ? "My GCI" : "My NET") : (_roleData.inside_payment_calculated_from == 0 ? "My GCI" : "My NET")}</label>
      </Grid>
      <Grid item xs={12}>
        {_roleData.note}
      </Grid>
    </Grid>
  );
};
export default PaidByInfoCard;
