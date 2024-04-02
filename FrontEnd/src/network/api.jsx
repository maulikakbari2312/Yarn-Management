import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "redux/action";

// Function to make a GET request
export const useApi = () => {
  const dispatch = useDispatch();
  const modelData = useSelector((state) => state.user.modelData?.fieldData);

  const getApi = async (url, headers = {}, body = null) => {
    try {
      const config = {
        headers,
      };

      if (body !== null) {
        let requestData = body;

        // Check if data is of type FormData, if not, trim keys and string values
        if (!(body instanceof FormData)) {
          const trimmedData = {};

          Object.keys(body).forEach(key => {
            const trimmedKey = key.trim();
            let trimmedValue = typeof body[key] === 'string' ? body[key].trim() : body[key];
            if (body[key] === "pcs" || body[key] === "denier") {
              trimmedValue = parseInt(body[key]);
            }
            // Check if the key is 'date' and format its value as dd/mm/yyyy
            if (trimmedKey.toLowerCase() === 'date' && trimmedValue instanceof Date) {
              const day = String(trimmedValue.getDate()).padStart(2, '0');
              const month = String(trimmedValue.getMonth() + 1).padStart(2, '0'); // Month is zero-based
              const year = trimmedValue.getFullYear();
              trimmedValue = `${day}/${month}/${year}`;
            }

            trimmedData[trimmedKey] = trimmedValue;
          });
          requestData = trimmedData;
        }

        // Use axios.post instead of axios.get
        const response = await axios.post(url, requestData, config);
        return response?.data;
      } else {
        // If no body is provided, make a GET request
        const response = await axios.get(url, config);
        return response?.data;
      }
    } catch (error) {
      // Dispatching an action using redux-thunk
      // dispatch(userLogout()); // Dispatch the action to log the user out
      throw error.response?.data;
    }
  };

  const postApi = async (url, data, headers = {}) => {
    try {
      let requestData = data;
      if (!(data instanceof FormData)) {
        const trimmedData = {};
        Object.keys(data).forEach(key => {
          const trimmedKey = key.trim();
          let trimmedValue = typeof data[key] === 'string' ? data[key].trim() : data[key];
          const matchedModel = modelData?.find(item => item?.name?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('') === trimmedKey);
          if (matchedModel && matchedModel.type === 'number') {
            trimmedValue = parseFloat(trimmedValue);
            if (isNaN(trimmedValue)) {
              trimmedValue = data[key];
            }
          }
          if (trimmedKey.toLowerCase() === 'date') {
            // Check if the key is 'date' and convert its value to dd/mm/yyyy format
            const dateParts = trimmedValue.split('-');
            if (dateParts.length === 3) {
              const [year, month, day] = dateParts;
              const formattedDate = `${day}/${month}/${year}`;
              trimmedValue = formattedDate;
            }
          }

          trimmedData[trimmedKey] = trimmedValue;
        });
        requestData = trimmedData;
      }

      const response = await axios.post(url, requestData, { headers });
      return response?.data;
    } catch (error) {
      throw error.response?.data;
    }
  };

  const putApi = async (url, data, headers = {}) => {
    try {
      let requestData = data;

      if (!(data instanceof FormData)) {
        const trimmedData = {};

        Object.keys(data).forEach(key => {
          const trimmedKey = key.trim();
          let trimmedValue = typeof data[key] === 'string' ? data[key].trim() : data[key];

          const matchedModel = modelData?.find(item => item.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('') === trimmedKey);
          if (matchedModel && matchedModel.type === 'number') {
            trimmedValue = parseFloat(trimmedValue);
            if (isNaN(trimmedValue)) {
              trimmedValue = data[key];
            }
          }

          if (trimmedKey.toLowerCase() === 'date') {
            const dateParts = trimmedValue.split('-');
            if (dateParts.length === 3) {
              const [year, month, day] = dateParts;
              const formattedDate = `${day}/${month}/${year}`;
              trimmedValue = formattedDate;
            }
          }

          trimmedData[trimmedKey] = trimmedValue;
        });
        requestData = trimmedData;
      }

      const response = await axios.put(url, requestData, { headers });
      return response?.data;
    } catch (error) {
      throw error.response?.data;
    }
  };

  const patchApi = async (url, data, headers = {}) => {
    try {
      let requestData = data;

      if (!(data instanceof FormData)) {
        const trimmedData = {};

        Object.keys(data).forEach(key => {
          const trimmedKey = key.trim();
          let trimmedValue = typeof data[key] === 'string' ? data[key].trim() : data[key];

          const matchedModel = modelData?.find(item => item.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('') === trimmedKey);
          if (matchedModel && matchedModel.type === 'number') {
            trimmedValue = parseFloat(trimmedValue);
            if (isNaN(trimmedValue)) {
              trimmedValue = data[key];
            }
          }

          if (trimmedKey.toLowerCase() === 'date') {
            const dateParts = trimmedValue.split('-');
            if (dateParts.length === 3) {
              const [year, month, day] = dateParts;
              const formattedDate = `${day}/${month}/${year}`;
              trimmedValue = formattedDate;
            }
          }

          trimmedData[trimmedKey] = trimmedValue;
        });
        requestData = trimmedData;
      }

      const response = await axios.patch(url, requestData, { headers });
      return response?.data;
    } catch (error) {
      throw error.response?.data;
    }
  };

  const deleteApi = async (url, headers = {}) => {
    try {
      const response = await axios.delete(url, { headers });
      return response?.data;
    } catch (error) {
      throw error.response?.data;
    }
  };

  return { getApi, postApi, putApi, deleteApi, patchApi };
};


// Function to make a POST request
// export const postApi = async (url, data, headers = {}) => {
//   try {
//     let requestData = data;

//     // Check if data is of type FormData, if not, trim keys and string values
//     if (!(data instanceof FormData)) {
//       const trimmedData = {};

//       Object.keys(data).forEach(key => {
//         const trimmedKey = key.trim();
//         let trimmedValue = typeof data[key] === 'string' ? data[key].trim() : data[key];

//         if (trimmedKey.toLowerCase() === 'date') {
//           // Check if the key is 'date' and convert its value to dd/mm/yyyy format
//           const dateParts = trimmedValue.split('-');
//           if (dateParts.length === 3) {
//             const [year, month, day] = dateParts;
//             const formattedDate = `${day}/${month}/${year}`;
//             trimmedValue = formattedDate;
//           }
//         }

//         trimmedData[trimmedKey] = trimmedValue;
//       });
//       requestData = trimmedData;
//     }

//     const response = await axios.post(url, requestData, { headers });
//     return response?.data;
//   } catch (error) {
//     throw error.response?.data;
//   }
// };

// // Function to make a PUT request
// export const putApi = async (url, data, headers = {}) => {
//   try {
//     let requestData = data;

//     // Check if data is of type FormData, if not, trim keys and string values
//     if (!(data instanceof FormData)) {
//       const trimmedData = {};

//       Object.keys(data).forEach(key => {
//         const trimmedKey = key.trim();
//         let trimmedValue = typeof data[key] === 'string' ? data[key].trim() : data[key];

//         if (trimmedKey.toLowerCase() === 'date') {
//           // Check if the key is 'date' and convert its value to dd/mm/yyyy format
//           const dateParts = trimmedValue.split('-');
//           if (dateParts.length === 3) {
//             const [year, month, day] = dateParts;
//             const formattedDate = `${day}/${month}/${year}`;
//             trimmedValue = formattedDate;
//           }
//         }

//         trimmedData[trimmedKey] = trimmedValue;
//       });
//       requestData = trimmedData;
//     }

//     const response = await axios.put(url, requestData, { headers });
//     return response?.data;
//   } catch (error) {
//     throw error.response?.data;
//   }
// };

// // Function to make a DELETE request
// export const deleteApi = async (url, headers = {}) => {
//   try {
//     const response = await axios.delete(url, { headers });
//     return response?.data;
//   } catch (error) {
//     throw error.response?.data;
//   }
// };
