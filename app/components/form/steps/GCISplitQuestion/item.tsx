import React from '@libs/react'
import { IGCIInfoItemProps } from "../../../../models/type";



const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  role,
  GCIValue,
}) => {
  const { useState } = React;

  const [sharePercent, setSharePercent] = useState<number>(5); // default 5% NEED_TO_UPDATE_THIS_CODE

  console.log('GCIValue:', GCIValue);
  console.log('GCIValue###########:', Number(GCIValue) / 20);
  return (
    <Grid container spacing={2} style={{ paddingBottom: 10 }}>
      <Grid item xs={6}>
        <Box>
          <label style={{ fontSize: 13, marginTop: 11 }}>
            {role.legal_full_name}
          </label>
        </Box>
        <Box>
          <label style={{ fontSize: 13, color: '#ababab' }}>
            {role.role}
          </label>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <TextField
          required
          size='small'
          label="Share(%)"
          defaultValue={5}
          value={sharePercent}
          onChange={(e: any) => setSharePercent(e.target.value)}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          required
          size='small'
          label="Share($)"
          // defaultValue={22500}
          // defaultValue={(Number(GCIValue) / 20) + ""}
          value={Number(GCIValue) / 100 * sharePercent}
          style={{ width: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

export default GCIInfoItem;