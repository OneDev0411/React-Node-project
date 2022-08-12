import React from "@libs/react";
import { IPaidByInfoCardProps, IRoleData } from "../../../../models/type";
import useApp from "../../../../hooks/useApp";

const PaidByInfoCard: React.FC<IPaidByInfoCardProps> = ({
  Ui: {
    Grid,
  },
  index,
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
        {_roleData.payment_unit_type == 0 ? `${_roleData.payment_value}%` : `$${_roleData.payment_value}`}
      </Grid>
      <Grid item xs={12}>
        Calculated from: <label>{_roleData.payment_calculated_from ? "My GCI" : "My NET"}</label>
      </Grid>
      <Grid item xs={12}>
        {_roleData.note}
      </Grid>
    </Grid>
  );
};
export default PaidByInfoCard;
