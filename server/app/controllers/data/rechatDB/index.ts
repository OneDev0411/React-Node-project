const readAllData = async (model: any) => {
  const res = await model.findAll();
  return res;
};

export default {
  readAllData,
};
