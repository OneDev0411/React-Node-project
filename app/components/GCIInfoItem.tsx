import { IGCIInfoItemProps } from "../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  itemData,
}) => {
  return (
    <Box style={{ width: 600, paddingLeft: 20 }}>
      <Grid container spacing={2} style={{ paddingBottom: 30 }}>
        <Grid item xs={7}>
          <Grid container spacing={2} style={{ paddingBottom: 0 }}>
            <Grid item xs={12} style={{ padding: 0 }}>
              <label style={{ fontSize: 13, marginTop: 11 }}>
                {itemData.name}
              </label>
            </Grid>
            <Grid item xs={12} style={{ padding: 0 }}>
              <label style={{ fontSize: 13, color: '#ababab' }}>
                {itemData.role}
              </label>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <TextField
            required
            size='small'
            label="Share(%)"
            defaultValue={itemData.share}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            size='small'
            label="Share($)"
            defaultValue={itemData.share2}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default GCIInfoItem;