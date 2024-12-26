export const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    // Fallback nếu không lấy được IP
    return 'unknown-' + Math.random().toString(36).substr(2, 9);
  }
}; 