import { IPaidByInfoCardProps } from "../../../../models/type"
import { stylizeNumber } from "../../../../util"

const PaidByInfoCard: React.FC<IPaidByInfoCardProps> = ({
  Ui: {
    Grid,
  },
  paidByData,
}) => {
  return (
    <Grid container style={{ marginTop: "5px" }}>
      <Grid item xs={12}>
        {paidByData.payment_by_name}
        <label style={{ marginLeft: 10, fontSize: 13, color: "#ababab" }}>{paidByData.role}</label>
      </Grid>
      <Grid item xs={12}>
        {paidByData.payment_unit_type == 0 ? `${paidByData.payment_value}%` : `$${stylizeNumber(Number(paidByData.payment_value))}`}
      </Grid>
      <Grid item xs={12}>
        Calculated from: <label>{paidByData.payment_calculated_from == 0 ? "My GCI" : "My NET"}</label>
      </Grid>
      <Grid item xs={12}>
        {paidByData.payment_note}
      </Grid>
    </Grid>
  )
}
export default PaidByInfoCard
