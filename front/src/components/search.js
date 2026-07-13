// import React, { useState,useEffect } from 'react';
// import './search.css';


// function SearchInput() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     handleSearch();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/product/${searchTerm}`);
//       setData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
  
//   };

//   return (
//     <div className="search-input">
//        <input type="text" 
//        placeholder="Search ..." 
//        value={searchTerm} 
//        onChange={(e) => setSearchTerm(e.target.value)} />
//       <button onClick={handleSearch}>Search</button>
     
//     </div>
//   );
// }

// export default SearchInput;
