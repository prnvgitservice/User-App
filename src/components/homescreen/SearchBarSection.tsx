import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Modal, TextInput, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCategories, getAllPincodes } from "../../api/apiMethods";
import { Ionicons } from '@expo/vector-icons';


const SearchableDropdown = ({ placeholder, options, selectedValue, onValueChange, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = selectedValue
    ? options.find((opt) => opt.value === selectedValue)?.label || placeholder
    : placeholder;

  const handleOpen = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  return (
    <View className="flex-1 relative">
      <TouchableOpacity
        onPress={handleOpen}
        className={`flex flex-row items-center justify-between px-4 py-3 border border-gray-300 rounded-lg ${
          disabled ? "bg-gray-100" : "bg-white"
        }`}
      >
        <Text className={`${disabled ? "text-gray-400" : "text-gray-700"}`}>{selectedLabel}</Text>
        <Ionicons name="caret-down-sharp" size={15} color={disabled ? "#9CA3AF" : "#374151"} />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true} animationType="fade" >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" , paddingTop: 30 ,paddingBottom: 30}}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                className="bg-white rounded-lg p-4 w-full max-h-[100%]"
                onStartShouldSetResponder={() => true}
                style={{width:"80%"}}
              >
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  placeholder="Search..."
                  value={search}
                  onChangeText={setSearch}
                  autoFocus={true}
                />
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-3 border-b border-gray-200"
                      onPress={() => {
                        onValueChange(item.value);
                        setVisible(false);
                        setSearch("");
                      }}
                    >
                      <Text className="text-gray-700">{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const SearchBarSection = () => {
  const navigation = useNavigation();

  // States for dropdowns
  const [categories, setCategories] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [subAreaOptions, setSubAreaOptions] = useState([]);

  // Selected values
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    slug: "",
    id: "",
  });
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");

  const [error, setError] = useState(null);
  const cityOptions = ["Hyderabad"];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success && Array.isArray(res.data)) {
          setCategories(
            res.data.sort((a, b) =>
              a.category_name
                .toLowerCase()
                .localeCompare(b.category_name.toLowerCase())
            )
          );
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch pincode and area data
  useEffect(() => {
    const fetchPincodeInfo = async () => {
      try {
        const res = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          setPincodeData(res.data);
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincodes");
      }
    };
    fetchPincodeInfo();
  }, []);

  // Update area options when pincodeData is available
  useEffect(() => {
    const flattenedAreas = pincodeData.flatMap((p) =>
      p.areas.map((area) => ({
        ...area,
        pincode: p.code,
        state: p.state,
        city: p.city,
      }))
    );
    setAreaOptions(flattenedAreas);
  }, [pincodeData]);

  // Handle area selection and update subareas
  const handleAreaChange = (areaName) => {
    setSelectedArea(areaName);

    const matchedPincodeObj = pincodeData.find((p) =>
      p.areas.some((a) => a.name === areaName)
    );

    if (matchedPincodeObj) {
      setSelectedPincode(matchedPincodeObj.code);
      setSelectedState(matchedPincodeObj.state);
      setSelectedCity(matchedPincodeObj.city);

      const matchedArea = matchedPincodeObj.areas.find(
        (a) => a.name === areaName
      );
      const subAreas = matchedArea?.subAreas || [];

      setSubAreaOptions(
        [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
      );
      setSelectedSubArea("");
    } else {
      setSelectedPincode("");
      setSubAreaOptions([]);
      setSelectedSubArea("");
    }
  };

  const handleCategoryChange = (categoryName) => {
    const index = categories.findIndex(
      (cat) => cat.category_name === categoryName
    );
    if (index >= 0) {
      const cat = categories[index];
      setSelectedCategory({
        name: cat.category_name,
        slug: cat.category_slug,
        id: cat._id,
      });
    } else {
      setSelectedCategory({ name: "", slug: "", id: "" });
    }
  };

  const handleSearch = async () => {
    if (!selectedCategory.slug || !selectedCity) {
      setError("Please select category and city");
      return;
    }

    const citySlug = selectedCity.toLowerCase().replace(/\s+/g, "-");
    const areaSlug = selectedArea.toLowerCase().replace(/\s+/g, "-");
    const subAreaSlug = selectedSubArea.toLowerCase().replace(/\s+/g, "-");

    const searchData = {
      category: selectedCategory.id,
      areaName: selectedArea,
      subArea: selectedSubArea,
      pincode: selectedPincode,
      city: selectedCity,
      state: selectedState,
    };

    try {
      setSelectedCategory({ name: "", slug: "", id: "" });
      setSelectedCity("Hyderabad");
      setSelectedState("Telangana");
      setSelectedPincode("");
      setSelectedArea("");
      setSelectedSubArea("");
      setSubAreaOptions([]);
      setError(null);
    } catch (err) {
      setError("Error saving search data");
      return;
    }

    navigation.navigate("SearchFilter", {
      path: `/${selectedCategory.slug}/${citySlug}/${areaSlug}-${selectedPincode}`,
      categoryId: selectedCategory.id,
      pincode: selectedPincode,
      Area: selectedArea || null,
      subArea: selectedSubArea,
      city: selectedCity,
      state: selectedState,
      category: selectedCategory.name,
    });
  };

  const handleReset = () => {
    setSelectedCategory({ name: "", slug: "", id: "" });
    setSelectedCity("Hyderabad");
    setSelectedState("Telangana");
    setSelectedPincode("");
    setSelectedArea("");
    setSelectedSubArea("");
    setSubAreaOptions([]);
    setError(null);
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.category_name,
    value: cat.category_name,
  }));

  const cityOptionList = cityOptions.map((city) => ({
    label: city,
    value: city,
  }));

  const areaOptionList = areaOptions
    .sort((a, b) => Number(a.pincode) - Number(b.pincode))
    .map((area) => ({
      label: `${area.name} - ${area.pincode}`,
      value: area.name,
    }));

  const subAreaOptionList = subAreaOptions.map((sub) => ({
    label: sub.name,
    value: sub.name,
  }));

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

      <View className="max-w-screen-lg mx-auto">
        <View className="flex flex-col gap-2 w-full">
          {/* First Row: Category and City Pickers */}
          <View className="flex flex-row gap-4 w-full">
            {/* Category Dropdown */}
            <SearchableDropdown
              placeholder="Select Category"
              options={categoryOptions}
              selectedValue={selectedCategory.name}
              onValueChange={handleCategoryChange}
            />

            {/* City Dropdown */}
            <SearchableDropdown
              placeholder="Select City"
              options={cityOptionList}
              selectedValue={selectedCity}
              onValueChange={setSelectedCity}
            />
          </View>

          {/* Second Row: Area and Subarea Pickers */}
          <View className="flex flex-row gap-4 w-full">
            {/* Area Dropdown */}
            <SearchableDropdown
              placeholder="Select Area"
              options={areaOptionList}
              selectedValue={selectedArea}
              onValueChange={handleAreaChange}
            />

            {/* Subarea Dropdown */}
            <SearchableDropdown
              placeholder="Select Subarea"
              options={subAreaOptionList}
              selectedValue={selectedSubArea}
              onValueChange={setSelectedSubArea}
              disabled={subAreaOptions.length === 0}
            />
          </View>

          {/* Action Buttons */}
          <View className="flex flex-row justify-center gap-3 mt-4">
            <TouchableOpacity
              className="flex flex-row items-center gap-2 px-6 py-3 bg-orange-500 rounded-lg"
              onPress={handleSearch}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold">Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center gap-2 px-4 py-3 bg-gray-200 rounded-lg"
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={18} color="#374151" />
              <Text className="text-gray-700 font-semibold">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchBarSection;
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, Platform } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getAllCategories, getAllPincodes } from "../../api/apiMethods";

// const SearchBarSection = () => {
//   const navigation = useNavigation();

//   // States for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");

//   const [error, setError] = useState(null);
//   const cityOptions = ["Hyderabad"];

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(
//             res.data.sort((a, b) =>
//               a.category_name
//                 .toLowerCase()
//                 .localeCompare(b.category_name.toLowerCase())
//             )
//           );
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (areaName) => {
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];

//       setSubAreaOptions(
//         [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//       );
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }
//   };

//   const handleCategoryChange = (categoryName) => {
//     const index = categories.findIndex(
//       (cat) => cat.category_name === categoryName
//     );
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//     }
//   };

//   const handleSearch = async () => {
//     if (!selectedCategory.slug || !selectedCity) {
//       setError("Please select category and city");
//       return;
//     }

//     const citySlug = selectedCity.toLowerCase().replace(/\s+/g, "-");
//     const areaSlug = selectedArea.toLowerCase().replace(/\s+/g, "-");
//     const subAreaSlug = selectedSubArea.toLowerCase().replace(/\s+/g, "-");

//     const searchData = {
//       category: selectedCategory.id,
//       areaName: selectedArea,
//       subArea: selectedSubArea,
//       pincode: selectedPincode,
//       city: selectedCity,
//       state: selectedState,
//     };

//     try {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setSelectedCity("Hyderabad");
//       setSelectedState("Telangana");
//       setSelectedPincode("");
//       setSelectedArea("");
//       setSelectedSubArea("");
//       setSubAreaOptions([]);
//       setError(null);
//     } catch (err) {
//       setError("Error saving search data");
//       return;
//     }

//     navigation.navigate("SearchFilter", {
//       path: `/${selectedCategory.slug}/${citySlug}/${areaSlug}-${selectedPincode}`,
//       categoryId: selectedCategory.id,
//       pincode: selectedPincode,
//       Area: selectedArea || null,
//       subArea: selectedSubArea,
//       city: selectedCity,
//       state: selectedState,
//       category: selectedCategory.name,
//     });
//   };

//   const handleReset = () => {
//     setSelectedCategory({ name: "", slug: "", id: "" });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode("");
//     setSelectedArea("");
//     setSelectedSubArea("");
//     setSubAreaOptions([]);
//     setError(null);
//   };

//   return (
//     <View className="flex-1 p-4 bg-gray-100">
//       {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

//       <View className="max-w-screen-lg mx-auto">
//         <View className="flex flex-col gap-2 w-full">
//           {/* First Row: Category and City Pickers */}
//           <View className="flex flex-row gap-4 w-full">
//             {/* Category Picker */}
//             <View className="flex-1 relative">
//               {/* <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
//                 <Icon name="category" size={20} color="#3B82F6" />
//               </View> */}
//               <Picker
//                 selectedValue={selectedCategory.name}
//                 onValueChange={(value) => handleCategoryChange(value)}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor: "#D1D5DB",
//                   borderRadius: 8,
//                   backgroundColor: "#FFFFFF",
//                   color: "#374151",
//                 }}
//               >
//                 <Picker.Item label="Select Category" value="" enabled={false} />
//                 {categories.map((cat, idx) => (
//                   <Picker.Item
//                     key={idx}
//                     label={cat.category_name}
//                     value={cat.category_name}
//                   />
//                 ))}
//               </Picker>
//             </View>

//             {/* City Picker */}
//             <View className="flex-1 relative">
//               {/* <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
//                 <Icon name="location-pin" size={20} color="#3B82F6" />
//               </View> */}
//               <Picker
//                 selectedValue={selectedCity}
//                 onValueChange={(value) => setSelectedCity(value)}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor: "#D1D5DB",
//                   borderRadius: 8,
//                   backgroundColor: "#FFFFFF",
//                   color: "#374151",
//                 }}
//               >
//                 <Picker.Item label="Select City" value="" enabled={false} />
//                 {cityOptions.map((city, idx) => (
//                   <Picker.Item key={idx} label={city} value={city} />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           {/* Second Row: Area and Subarea Pickers */}
//           <View className="flex flex-row gap-4 w-full">
//             {/* Area Picker */}
//             <View className="flex-1 relative">
//               {/* <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
//                 <Icon name="location-pin" size={20} color="#3B82F6" />
//               </View> */}
//               <Picker
//                 selectedValue={selectedArea}
//                 onValueChange={(value) => handleAreaChange(value)}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor: "#D1D5DB",
//                   borderRadius: 8,
//                   backgroundColor: "#FFFFFF",
//                   color: "#374151",
//                 }}
//               >
//                 <Picker.Item label="Select Area" value="" enabled={false} />
//                 {areaOptions
//                   .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                   .map((area, idx) => (
//                     <Picker.Item
//                       key={idx}
//                       label={`${area.name} - ${area.pincode}`}
//                       value={area.name}
//                     />
//                   ))}
//               </Picker>
//             </View>

//             {/* Subarea Picker */}
//             <View className="flex-1 relative">
//               {/* <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
//                 <Icon name="location-pin" size={20} color="#3B82F6" />
//               </View> */}
//               <Picker
//                 selectedValue={selectedSubArea}
//                 onValueChange={(value) => setSelectedSubArea(value)}
//                 enabled={subAreaOptions.length > 0}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor:
//                     subAreaOptions.length > 0 ? "#D1D5DB" : "#E5E7EB",
//                   borderRadius: 8,
//                   backgroundColor:
//                     subAreaOptions.length > 0 ? "#FFFFFF" : "#F3F4F6",
//                   color: subAreaOptions.length > 0 ? "#374151" : "#9CA3AF",
//                 }}
//               >
//                 <Picker.Item label="Select Subarea" value="" enabled={false} />
//                 {subAreaOptions.map((sub, idx) => (
//                   <Picker.Item
//                     key={sub._id || idx}
//                     label={sub.name}
//                     value={sub.name}
//                   />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <View className="flex flex-row justify-center gap-3 mt-4">
//             <TouchableOpacity
//               className="flex flex-row items-center gap-2 px-6 py-3 bg-orange-500 rounded-lg"
//               onPress={handleSearch}
//             >
//               <Icon name="search" size={20} color="#FFFFFF" />
//               <Text className="text-white font-semibold">Search</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex flex-row items-center gap-2 px-4 py-3 bg-gray-200 rounded-lg"
//               onPress={handleReset}
//             >
//               <Icon name="refresh" size={20} color="#374151" />
//               <Text className="text-gray-700 font-semibold">Reset</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SearchBarSection;
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons"; // Assuming Expo for icons; adjust if needed
// import { getAllCategories, getAllPincodes as fetchPincodes } from "../../api/apiMethods"; // Assume API methods are adapted for RN

// function SearchBarSection() {
//   const navigation = useNavigation();

//   // States for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("Hyderabad");
//   const [selectedState, setSelectedState] = useState("Telangana");
//   const [selectedCategory, setSelectedCategory] = useState({ name: '', slug: '', id: '' });
//   const [selectedArea, setSelectedArea] = useState('');
//   const [selectedPincode, setSelectedPincode] = useState('');
//   const [selectedSubArea, setSelectedSubArea] = useState('');

//   const [error, setError] = useState(null);
//   const cityOptions = ["Hyderabad"];

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         if (res.success && Array.isArray(res.data)) {
//           setCategories(res?.data?.sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())));
//         } else {
//           setError("Failed to fetch categories");
//         }
//       } catch (err) {
//         setError("Error fetching categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await fetchPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap(p =>
//       p.areas.map(area => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city
//       }))
//     );
//     setAreaOptions(flattenedAreas);
//   }, [pincodeData]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (areaName) => {
//     setSelectedArea(areaName);

//     // Find area and related pincode
//     const matchedPincodeObj = pincodeData.find(p =>
//       p.areas.some(a => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(a => a.name === areaName);
//       const subAreas = matchedArea?.subAreas || [];

//       setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
//       setSelectedSubArea('');
//     } else {
//       setSelectedPincode('');
//       setSubAreaOptions([]);
//       setSelectedSubArea('');
//     }
//   };

//   const handleCategoryChange = (categoryName) => {
//     const cat = categories.find(c => c.category_name === categoryName);
//     if (cat) {
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id
//       });
//     } else {
//       setSelectedCategory({ name: '', slug: '', id: '' });
//     }
//   };

//   const handleSearch = async () => {
//     if (!selectedCategory.slug) {
//       setError("Please select category");
//       return;
//     }

//     const citySlug = selectedCity.toLowerCase().replace(/\s+/g, "-");
//     const areaSlug = selectedArea.toLowerCase().replace(/\s+/g, "-");
//     const subAreaSlug = selectedSubArea.toLowerCase().replace(/\s+/g, "-");

//     const searchData = {
//       category: selectedCategory.id,
//       areaName: selectedArea,
//       pincode: selectedPincode,
//       city: selectedCity,
//       state: selectedState,
//     };

//     await AsyncStorage.setItem("selectAddress", JSON.stringify(searchData));

//     if (!selectedArea) {
//       navigation.navigate("Technicians", { // Assuming 'Technicians' is a route name; adjust as per your navigation setup
//         categoryId: selectedCategory.id,
//       });
//     } else {
//       navigation.navigate("CategoryArea", { // Assuming a route name like 'CategoryArea'; adjust accordingly
//         categorySlug: selectedCategory.slug,
//         citySlug,
//         areaSlug,
//         pincode: selectedPincode,
//         categoryId: selectedCategory.id,
//         subArea: selectedSubArea || null,
//       });
//     }
//   };

//   const handleReset = () => {
//     setSelectedCategory({ name: '', slug: '', id: '' });
//     setSelectedCity("Hyderabad");
//     setSelectedState("Telangana");
//     setSelectedPincode('');
//     setSelectedArea('');
//     setSelectedSubArea('');
//     setSubAreaOptions([]);
//     setError(null);
//   };

//   return (
//     <View className="items-center mb-8 px-4">

//       {error && <Text className="text-red-500 mb-4">{error}</Text>}

//       <View className="w-full">
//         <View className="flex flex-col gap-4">
//           {/* Category Dropdown */}
//           <View className="relative flex-1 min-w-[200px] border rounded-lg overflow-hidden">
//             <Picker
//               selectedValue={selectedCategory.name}
//               onValueChange={handleCategoryChange}
//               className="w-full pl-10 pr-4 py-3 text-gray-700"
//               >
//               <Picker.Item label="Select Category" value="" />
//               {categories.map((cat, idx) => (
//                   <Picker.Item key={idx} label={cat.category_name} value={cat.category_name} />
//                 ))}
//             </Picker>
//             <MaterialIcons
//               name="category"
//               size={20}
//               color="#60a5fa"
//               className="absolute left-3 top-1/2 -translate-y-1/2"
//               />
//           </View>

//           {/* City Dropdown */}
//           <View className="relative flex-1 min-w-[200px] border rounded-lg overflow-hidden">
//             <Picker
//               selectedValue={selectedCity}
//               onValueChange={setSelectedCity}
//               className="w-full pl-10 pr-4 py-3 text-gray-700"
//               >
//               <Picker.Item label="Select City" value="" />
//               {cityOptions.map((city, idx) => (
//                   <Picker.Item key={idx} label={city} value={city} />
//                 ))}
//             </Picker>
//             <Feather
//               name="map-pin"
//               size={20}
//               color="#60a5fa"
//               className="absolute left-3 top-1/2 -translate-y-1/2"
//               />
//           </View>

//           {/* Area Dropdown */}
//           <View className="relative flex-1 min-w-[200px] border rounded-lg overflow-hidden">
//             <Picker
//               selectedValue={selectedArea}
//               onValueChange={handleAreaChange}
//               className="w-full pl-10 pr-4 py-3 text-gray-700"
//               >
//               <Picker.Item label="Select Area" value="" />
//               {areaOptions
//                 .sort((a, b) => Number(a.pincode) - Number(b.pincode))
//                 .map((area, idx) => (
//                     <Picker.Item key={idx} label={`${area.name} - ${area.pincode}`} value={area.name} />
//                 ))}
//             </Picker>
//             <Feather
//               name="map-pin"
//               size={20}
//               color="#60a5fa"
//               className="absolute left-3 top-1/2 -translate-y-1/2"
//             />
//           </View>

//           {/* Subarea Dropdown */}
//           <View className="relative flex-1 min-w-[200px] border rounded-lg overflow-hidden">
//             <Picker
//               selectedValue={selectedSubArea}
//               onValueChange={setSelectedSubArea}
//               enabled={!!subAreaOptions.length}
//               className="w-full pl-10 pr-4 py-3 text-gray-700"
//               >
//               <Picker.Item label="Select Subarea" value="" />
//               {subAreaOptions.map((sub, idx) => (
//                   <Picker.Item key={sub._id || idx} label={sub.name} value={sub.name} />
//                 ))}
//             </Picker>
//             <Feather
//               name="map-pin"
//               size={20}
//               color="#60a5fa"
//               className="absolute left-3 top-1/2 -translate-y-1/2"
//               />
//           </View>

//           {/* Action Buttons */}
//           <View className="flex flex-row gap-3 mt-2">
//             <TouchableOpacity
//               className="flex flex-row items-center gap-2 px-6 py-3 bg-orange-500 rounded-lg"
//               onPress={handleSearch}
//               >
//               <Feather name="search" size={20} color="white" />
//               <Text className="text-white font-semibold">Search</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex flex-row items-center gap-2 px-4 py-3 bg-gray-200 rounded-lg"
//               onPress={handleReset}
//               >
//               <Ionicons name="refresh" size={20} color="gray" />
//               <Text className="text-gray-700 font-semibold">Reset</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// export default SearchBarSection;
{
  /* <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
  Hyderabad's Largest Marketplace !!
</Text>
<Text className="text-xl text-blue-700 font-semibold mb-8 text-center">
  Search From Awesome Verified Professionals
</Text> */
}
