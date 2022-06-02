import { IUserInfoCardProps } from "../models/type";

const AvatarURL = {
  step2: "https://d2dzyv4cb7po1i.cloudfront.net/8cb4a358-8973-11e7-9089-0242ac110003/avatars/b0940a30-5927-11ea-87b6-f3895293e651.jpg",
  step3: "https://d2dzyv4cb7po1i.cloudfront.net/8cb4a358-8973-11e7-9089-0242ac110003/avatars/7459ed70-47c6-11ec-8a58-79e1f90851e2.jpg",
  step4: "",
}

const UserInfoCard: React.FC<IUserInfoCardProps> = ({ 
  Ui: { Grid, Avatar, Box },
  cardData,
  step
}) => {
  return (
    <Box sx={{ width: '100%', marginTop: -5 }}>
      <Grid container style={{ marginBottom: 10, float: 'right', maxWidth: 600, border: 'solid 1px #dbdbdb', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }} className="UserInfo-Card">
        <Grid item xs={2} style={{ maxWidth: 77 }}>
          <Avatar alt="Remy Sharp" src={AvatarURL[`step${step}`]} style={{ paddingTop: '0px !important', width: '70%', height: '88%', marginLeft: 12, marginTop: 4 }} />
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            <label>
              <strong>
                {cardData.userName}
              </strong>
            </label>
            <label style={{ marginLeft: 20, color: '#949598', fontWeight: 300 }}>
              {cardData.role}
            </label>
          </Grid>
          <Grid container>
            <label style={{ color: '#949598', fontWeight: 300 }}>
              {cardData.phone}
            </label>
            <label style={{ marginLeft: 20, color: '#949598', fontWeight: 300 }}>
              {cardData.email}
            </label>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserInfoCard;