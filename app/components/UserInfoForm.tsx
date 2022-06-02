import { IUserInfoFormProps } from "../models/type";

const TabPanel:React.FC<any> = props => {
  const { children, value, index, Ui, ...other } = props;
  const { Box, Typography } = Ui;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const UserInfoForm:React.FC<IUserInfoFormProps> = ({ 
  handleClickButton, 
  defaultFormData,
  Ui,
  React: { useState }
}) => {
  const { InputLabel, Box, Tabs, Tab, MenuItem, FormControl, TextField, Button, Select, Grid } = Ui;

  const [value, setValue] = useState(0);

  const handleTabChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Person" {...a11yProps(0)} />
          <Tab label="Company/Trust" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} Ui={Ui}>
        <Grid container spacing={2} style={{ maxWidth: 600 }}>
          <Grid item xs={12}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={defaultFormData.role}
                  label="Seller"
                >
                  <MenuItem value={0}>Seller</MenuItem>
                  <MenuItem value={1}>Buyer</MenuItem>
                  <MenuItem value={2}>Agency</MenuItem>
                  <MenuItem value={3}>Buyer Attorney</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size='small'
              label="First Name"
              defaultValue={defaultFormData.firstName}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size='small'
              label="Last Name"
              defaultValue={defaultFormData.lastName}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <label style={{ color: '#00b286' }}>
              Add middle name and title
            </label>
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              size='small'
              label="Email"
              defaultValue={defaultFormData.email}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size='small'
              label="Phone"
              defaultValue={defaultFormData.phone}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              size='small'
              label="Company/Trust"
              defaultValue={defaultFormData.companyTrust}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size='small'
              label="Current Address"
              defaultValue={defaultFormData.currentAddress}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button style={{ color: 'black !important', marginRight: 10 }}>
              Cancel
            </Button>
            <Button style={{ color: 'black !important', borderColor: '#dbdbdb !important', marginRight: 10 }}>
              Save Only
            </Button>
            <Button onClick={handleClickButton} style={{ backgroundColor: '#0fb78d', color: 'white' }}>
              Save & Add to My Contact
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1} Ui={Ui}>
        Tab2 Content
      </TabPanel>
    </Box>
  );
}

export default UserInfoForm;