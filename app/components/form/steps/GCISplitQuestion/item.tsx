import { IGCIInfoItemProps } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  itemData,
}) => {
  return (
    <Grid container spacing={2} style={{ paddingBottom: 10 }}>
      <Grid item xs={6}>
        <Box>
          <label style={{ fontSize: 13, marginTop: 11 }}>
            {itemData.name}
          </label>
        </Box>
        <Box>
          <label style={{ fontSize: 13, color: '#ababab' }}>
            {itemData.role}
          </label>
        </Box>
      </Grid>
      <Grid item xs={3}>
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
  );
}

export default GCIInfoItem;