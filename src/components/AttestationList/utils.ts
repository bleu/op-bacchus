interface ParsedData {
  [key: string]: string;
}

export const parseData = (data: string): ParsedData => {
  const result: ParsedData = {};
  
  try {
    // Parse the JSON string into an array
    const parsedData = JSON.parse(data);
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Input data is not an array after parsing');
    }

    parsedData.forEach(item => {
      let value = item.value.value;
      
      // Handle BigNumber objects
      if (typeof value === 'object' && 'type' in value && value.type === 'BigNumber') {
        value = BigInt(value.hex).toString();
      }
      
      // Decode URI component if it's a string (assuming URL encoding)
      if (typeof value === 'string') {
        try {
          value = decodeURIComponent(value);
        } catch (e) {
          // If decoding fails, keep the original value
        }
      }
      
      result[item.name] = value as string;
    });
  } catch (error) {
    console.error('Error parsing or processing data:', error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
  
  return result;
};
