/* eslint-disable import/prefer-default-export */
// verilen obje keyine göre
export const createTableFilterFromData = (objectArray, objectKey) => {
  // filters: [
  //   {
  //     text: "London",
  //     value: "London",
  //   },
  //   {
  //     text: "New York",
  //     value: "New York",
  //   },
  // ],

  // const referencesSet = new Set(data.map((ds) => ds[objectKey]));

  const referencesSet = new Set(
    objectArray.map((object) =>
      object[objectKey] || object[objectKey] === 0 ? object[objectKey] : "Boş",
    ),
  );

  const uniqueReferences = [...referencesSet].map((r) => ({
    text: r,
    value: r,
  }));

  return uniqueReferences;
};
