import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import {
  userRegister,
  getAllPincodes,
} from "../../api/apiMethods";
import TermsConditionsScreen from "../profile/TermsConditionsScreen";

interface PincodeArea {
  _id: string;
  name: string;
  subAreas: { _id: string; name: string }[];
}

interface PincodeData {
  _id: string;
  code: string;
  city: string;
  state: string;
  areas: PincodeArea[];
}

interface FormData {
  name: string;
  mobile: string;
  password: string;
  buildingName: string;
  areaName: string;
  subAreaName: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  password?: string;
  buildingName?: string;
  areaName?: string;
  subAreaName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  general?: string;
  terms?: string;
}

const NAME_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

const sanitizeName = (v: string) => v.replace(/[^A-Za-z ]+/g, "");
const sanitizePhone = (v: string) => v.replace(/[^0-9]+/g, "").slice(0, 10);
const sanitizePassword = (v: string) => v.replace(/[^A-Za-z0-9@_#]+/g, "").slice(0, 10);

const initialFormState: FormData = {
  name: "",
  mobile: "",
  password: "",
  buildingName: "",
  areaName: "",
  subAreaName: "",
  city: "",
  state: "",
  pincode: "",
};

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    getAllPincodes()
      .then((res: any) => {
        if (Array.isArray(res?.data)) setPincodeData(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedPincode) {
      const found = pincodeData.find((p) => p.code === selectedPincode);
      if (found && found.areas) setAreaOptions(found.areas);
      else setAreaOptions([]);
      setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
      if (found) {
        setFormData((prev) => ({
          ...prev,
          city: found.city || "",
          state: found.state || "",
        }));
      }
    }
  }, [selectedPincode, pincodeData]);

  useEffect(() => {
    if (formData.areaName) {
      const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
      if (selectedArea && selectedArea.subAreas) setSubAreaOptions(selectedArea.subAreas);
      else setSubAreaOptions([]);
      setFormData((prev) => ({ ...prev, subAreaName: "" }));
    }
  }, [formData.areaName, areaOptions]);

  const handleChange = useCallback(
    (name: string, value: string) => {
      let sanitizedValue = value;
      if (name === "name") sanitizedValue = sanitizeName(value);
      if (name === "mobile") sanitizedValue = sanitizePhone(value);
      if (name === "password") sanitizedValue = sanitizePassword(value);
      if (name === "buildingName") sanitizedValue = value.trim();

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      if (name === "pincode") setSelectedPincode(sanitizedValue);
    },
    []
  );

  const validateForm = useCallback((): FormErrors => {
    const f = formData;
    const e: FormErrors = {};
    if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
    if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
    if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
    if (!f.buildingName.trim()) e.buildingName = "Building name is required";
    if (!f.pincode) e.pincode = "Pincode is required";
    if (!f.areaName) e.areaName = "Area is required";
    if (!f.subAreaName) e.subAreaName = "Sub Area is required";
    if (!f.city) e.city = "City is required";
    if (!f.state) e.state = "State is required";
    if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
    return e;
  }, [formData, agreedToTerms]);

  const handleSubmit = useCallback(
    async () => {
      const formErrors = validateForm();
      setErrors(formErrors);
      if (Object.keys(formErrors).length > 0) {
        Alert.alert("Validation Error", "Please fix the errors above.");
        return;
      }

      setLoading(true);
      try {
        const basePayload = {
          username: formData.name.trim(),
          phoneNumber: formData.mobile,
          password: formData.password,
          buildingName: formData.buildingName.trim(),
          areaName: formData.areaName,
          subAreaName: formData.subAreaName || "-",
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };
        const response = await userRegister(basePayload);

        if (response?.success) {
          Alert.alert("Success", "Registration successful! Please log in.");
          navigation.navigate("Login");
        }
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: err?.data?.error?.[0] || "Registration failed. Please try again.",
        }));
        Alert.alert("Error", "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigation, validateForm]
  );

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const openTerms = () => setShowTermsModal(true);
  const closeTerms = () => setShowTermsModal(false);

  const navigateToTechnicianSignup = () => navigation.navigate("SignupTechnician");
  const navigateToLogin = () => navigation.navigate("LoginUser");

  const checkboxClass = `text-xl ${agreedToTerms ? 'text-green-600' : 'text-gray-500'}`;

  const submitButtonClass = `p-3 rounded-md items-center mb-4 ${loading ? 'bg-gray-400' : 'bg-green-600'}`;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={styles.contentContainer}>
      <View className="items-center mb-5 p-1 rounded w-52 self-center">
        <Image
          // source={{ uri: 'https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png' }}
          source={require('../../../assets/prnv_logo.png')}
          className="h-20 w-auto"
          resizeMode="contain"
        />
      </View>

      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-2xl font-bold text-center mb-6 capitalize">
          Sign Up as User
        </Text>

        {errors.general && <Text className="text-red-600 text-sm text-center bg-red-50 p-2 rounded mb-4">{errors.general}</Text>}

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 text-base"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Enter name"
            maxLength={60}
            autoCapitalize="words"
          />
          {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Phone Number *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 text-base"
            value={formData.mobile}
            onChangeText={(text) => handleChange("mobile", text)}
            placeholder="Enter 10-digit number"
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.mobile && <Text className="text-red-500 text-xs mt-1">{errors.mobile}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Password *</Text>
          <View className="flex-row items-center border border-gray-300 rounded-md p-3">
            <TextInput
              className="flex-1 text-base"
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              placeholder="6–10 (A–Z, 0–9, @ _ #)"
              secureTextEntry={!showPassword}
              maxLength={10}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} className="ml-2 p-1">
              <Text className="text-sm text-gray-500">{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">House/Building Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 text-base"
            value={formData.buildingName}
            onChangeText={(text) => handleChange("buildingName", text)}
            placeholder="Enter building name"
          />
          {errors.buildingName && <Text className="text-red-500 text-xs mt-1">{errors.buildingName}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Pincode *</Text>
          <View className="border border-gray-300 rounded-md mt-1">
            <Picker
              selectedValue={formData.pincode}
              onValueChange={(value) => handleChange("pincode", value)}
              className="h-11"
            >
              <Picker.Item label="Select pincode" value="" />
              {pincodeData
                .sort((a: any, b: any) => Number(a.code) - Number(b.code))
                .map((p, index) => (
                  <Picker.Item key={p._id || index} label={p.code} value={p.code} />
                ))}
            </Picker>
          </View>
          {errors.pincode && <Text className="text-red-500 text-xs mt-1">{errors.pincode}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Area *</Text>
          <View className="border border-gray-300 rounded-md mt-1">
            <Picker
              selectedValue={formData.areaName}
              onValueChange={(value) => handleChange("areaName", value)}
              className="h-11"
            >
              <Picker.Item label="Select area" value="" />
              {areaOptions.map((a, index) => (
                <Picker.Item key={a._id || index} label={a.name} value={a.name} />
              ))}
            </Picker>
          </View>
          {errors.areaName && <Text className="text-red-500 text-xs mt-1">{errors.areaName}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">Sub Area *</Text>
          <View className="border border-gray-300 rounded-md mt-1">
            <Picker
              selectedValue={formData.subAreaName}
              onValueChange={(value) => handleChange("subAreaName", value)}
              className="h-11"
            >
              <Picker.Item label="Select sub area" value="" />
              {subAreaOptions
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                .map((a, index) => (
                  <Picker.Item key={a._id || index} label={a.name} value={a.name} />
                ))}
            </Picker>
          </View>
          {errors.subAreaName && <Text className="text-red-500 text-xs mt-1">{errors.subAreaName}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">City *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 text-base bg-gray-100"
            value={formData.city}
            editable={false}
            placeholder="Auto-filled"
          />
          {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-700 mb-1">State *</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 text-base bg-gray-100"
            value={formData.state}
            editable={false}
            placeholder="Auto-filled"
          />
          {errors.state && <Text className="text-red-500 text-xs mt-1">{errors.state}</Text>}
        </View>

        <View className="flex-row items-start mb-4">
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="mr-2 mt-0.5"
          >
            <Text className={checkboxClass}>{agreedToTerms ? "✓" : "☐"}</Text>
          </TouchableOpacity>
          <Text className="text-base text-gray-700 flex-1">
            I agree to the{" "}
            <TouchableOpacity onPress={openTerms}>
              <Text className="text-blue-600 font-medium underline">Terms & Conditions</Text>
            </TouchableOpacity>{" "}
            *
          </Text>
          {errors.terms && <Text className="text-red-500 text-xs mt-1">{errors.terms}</Text>}
        </View>

        <TouchableOpacity
          className={submitButtonClass}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center mb-2" onPress={navigateToTechnicianSignup}>
          <Text className="text-sm text-gray-600 text-center">
            Are you a technician? <Text className="text-blue-600 font-medium underline">Sign Up here</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="items-center pb-5" onPress={navigateToLogin}>
        <Text className="text-sm text-gray-600 text-center">
          Already Sign up? <Text className="text-blue-600 font-medium underline">Sign In</Text>
        </Text>
      </TouchableOpacity>

      <Modal visible={showTermsModal} onRequestClose={closeTerms} animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="absolute top-12 right-5 z-10">
            <TouchableOpacity onPress={closeTerms} className="p-1">
              <Text className="text-2xl text-white">×</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white p-5 rounded-lg w-[90%] max-h-[80%]">
            <Text className="text-xl font-bold text-center mb-5">Terms & Conditions</Text>
            <TermsConditionsScreen />
            <TouchableOpacity onPress={closeTerms} className="bg-blue-600 p-3 rounded items-center mt-5">
              <Text className="text-white text-base font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
});

export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import {
//   userRegister,
//   getAllPincodes,
// } from "../../api/apiMethods";
// import TermsConditionsScreen from "../profile/TermsConditionsScreen";

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   subAreaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
//   terms?: string;
// }

// const NAME_REGEX = /^[A-Za-z ]+$/;
// const PHONE_REGEX = /^[0-9]{10}$/;
// const PASS_REGEX = /^[A-Za-z0-9@_#]{6,10}$/;

// const sanitizeName = (v: string) => v.replace(/[^A-Za-z ]+/g, "");
// const sanitizePhone = (v: string) => v.replace(/[^0-9]+/g, "").slice(0, 10);
// const sanitizePassword = (v: string) => v.replace(/[^A-Za-z0-9@_#]+/g, "").slice(0, 10);

// const initialFormState: FormData = {
//   name: "",
//   mobile: "",
//   password: "",
//   buildingName: "",
//   areaName: "",
//   subAreaName: "",
//   city: "",
//   state: "",
//   pincode: "",
// };

// const RegisterScreen: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>("");
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
//   const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
//   const navigation = useNavigation<any>();

//   useEffect(() => {
//     getAllPincodes()
//       .then((res: any) => {
//         if (Array.isArray(res?.data)) setPincodeData(res.data);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) setAreaOptions(found.areas);
//       else setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, areaName: "", subAreaName: "" }));
//       if (found) {
//         setFormData((prev) => ({
//           ...prev,
//           city: found.city || "",
//           state: found.state || "",
//         }));
//       }
//     }
//   }, [selectedPincode, pincodeData]);

//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) setSubAreaOptions(selectedArea.subAreas);
//       else setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: "" }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const handleChange = useCallback(
//     (name: string, value: string) => {
//       let sanitizedValue = value;
//       if (name === "name") sanitizedValue = sanitizeName(value);
//       if (name === "mobile") sanitizedValue = sanitizePhone(value);
//       if (name === "password") sanitizedValue = sanitizePassword(value);
//       if (name === "buildingName") sanitizedValue = value.trim();

//       setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
//       if (name === "pincode") setSelectedPincode(sanitizedValue);
//     },
//     []
//   );

//   const validateForm = useCallback((): FormErrors => {
//     const f = formData;
//     const e: FormErrors = {};
//     if (!f.name.trim() || !NAME_REGEX.test(f.name.trim())) e.name = "Only alphabets allowed";
//     if (!PHONE_REGEX.test(f.mobile)) e.mobile = "Enter 10-digit number";
//     if (!PASS_REGEX.test(f.password)) e.password = "6–10 chars: A–Z, 0–9, @ _ #";
//     if (!f.buildingName.trim()) e.buildingName = "Building name is required";
//     if (!f.pincode) e.pincode = "Pincode is required";
//     if (!f.areaName) e.areaName = "Area is required";
//     if (!f.subAreaName) e.subAreaName = "Sub Area is required";
//     if (!f.city) e.city = "City is required";
//     if (!f.state) e.state = "State is required";
//     if (!agreedToTerms) e.terms = "You must agree to the Terms & Conditions";
//     return e;
//   }, [formData, agreedToTerms]);

//   const handleSubmit = useCallback(
//     async () => {
//       const formErrors = validateForm();
//       setErrors(formErrors);
//       if (Object.keys(formErrors).length > 0) {
//         Alert.alert("Validation Error", "Please fix the errors above.");
//         return;
//       }

//       setLoading(true);
//       try {
//         const basePayload = {
//           username: formData.name.trim(),
//           phoneNumber: formData.mobile,
//           password: formData.password,
//           buildingName: formData.buildingName.trim(),
//           areaName: formData.areaName,
//           subAreaName: formData.subAreaName || "-",
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//         };
//         const response = await userRegister(basePayload);

//         if (response?.success) {
//           navigation.navigate("Login");
//         }
//       } catch (err: any) {
//         setErrors((prev) => ({
//           ...prev,
//           general: err?.data?.error?.[0] || "Registration failed. Please try again.",
//         }));
//         Alert.alert("Error", "Registration failed. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, navigation, validateForm]
//   );

//   const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

//   const openTerms = () => setShowTermsModal(true);
//   const closeTerms = () => setShowTermsModal(false);

//   const navigateToTechnicianSignup = () => navigation.navigate("SignupTechnician");
//   const navigateToLogin = () => navigation.navigate("LoginUser");

//   const checkboxClass = `text-xl ${agreedToTerms ? 'text-green-600' : 'text-gray-500'}`;

//   const submitButtonClass = `p-3 rounded-md items-center mb-4 ${loading ? 'bg-gray-400' : 'bg-green-600'}`;

//   return (
//     <ScrollView className="flex-1 bg-white" contentContainerStyle={styles.contentContainer}>
//       <View className="items-center mb-5 bg-blue-900 p-1 rounded w-52 self-center">
//         <Image
//           // source={{ uri: 'https://old.prnvservices.com/uploads/logo/1695377568_logo-white.png' }}
//           source={require('../../../assets/prnv_logo.jpg')}
//           className="h-8 w-auto"
//           resizeMode="contain"
//         />
//       </View>

//       <View className="bg-white p-4 rounded-lg shadow-md">
//         <Text className="text-2xl font-bold text-center mb-6 capitalize">
//           Sign Up as User
//         </Text>

//         {errors.general && <Text className="text-red-600 text-sm text-center bg-red-50 p-2 rounded mb-4">{errors.general}</Text>}

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Name *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-md p-3 text-base"
//             value={formData.name}
//             onChangeText={(text) => handleChange("name", text)}
//             placeholder="Enter name"
//             maxLength={60}
//             autoCapitalize="words"
//           />
//           {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Phone Number *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-md p-3 text-base"
//             value={formData.mobile}
//             onChangeText={(text) => handleChange("mobile", text)}
//             placeholder="Enter 10-digit number"
//             keyboardType="phone-pad"
//             maxLength={10}
//           />
//           {errors.mobile && <Text className="text-red-500 text-xs mt-1">{errors.mobile}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Password *</Text>
//           <View className="flex-row items-center border border-gray-300 rounded-md p-3">
//             <TextInput
//               className="flex-1 text-base"
//               value={formData.password}
//               onChangeText={(text) => handleChange("password", text)}
//               placeholder="6–10 (A–Z, 0–9, @ _ #)"
//               secureTextEntry={!showPassword}
//               maxLength={10}
//             />
//             <TouchableOpacity onPress={togglePasswordVisibility} className="ml-2 p-1">
//               <Text className="text-sm text-gray-500">{showPassword ? "Hide" : "Show"}</Text>
//             </TouchableOpacity>
//           </View>
//           {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">House/Building Name *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-md p-3 text-base"
//             value={formData.buildingName}
//             onChangeText={(text) => handleChange("buildingName", text)}
//             placeholder="Enter building name"
//           />
//           {errors.buildingName && <Text className="text-red-500 text-xs mt-1">{errors.buildingName}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Pincode *</Text>
//           <View className="border border-gray-300 rounded-md mt-1">
//             <Picker
//               selectedValue={formData.pincode}
//               onValueChange={(value) => handleChange("pincode", value)}
//               className="h-11"
//             >
//               <Picker.Item label="Select pincode" value="" />
//               {pincodeData
//                 .sort((a: any, b: any) => Number(a.code) - Number(b.code))
//                 .map((p) => (
//                   <Picker.Item key={p._id} label={p.code} value={p.code} />
//                 ))}
//             </Picker>
//           </View>
//           {errors.pincode && <Text className="text-red-500 text-xs mt-1">{errors.pincode}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Area *</Text>
//           <View className="border border-gray-300 rounded-md mt-1">
//             <Picker
//               selectedValue={formData.areaName}
//               onValueChange={(value) => handleChange("areaName", value)}
//               className="h-11"
//             >
//               <Picker.Item label="Select area" value="" />
//               {areaOptions.map((a) => (
//                 <Picker.Item key={a._id} label={a.name} value={a.name} />
//               ))}
//             </Picker>
//           </View>
//           {errors.areaName && <Text className="text-red-500 text-xs mt-1">{errors.areaName}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">Sub Area *</Text>
//           <View className="border border-gray-300 rounded-md mt-1">
//             <Picker
//               selectedValue={formData.subAreaName}
//               onValueChange={(value) => handleChange("subAreaName", value)}
//               className="h-11"
//             >
//               <Picker.Item label="Select sub area" value="" />
//               {subAreaOptions
//                 .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                 .map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} />
//                 ))}
//             </Picker>
//           </View>
//           {errors.subAreaName && <Text className="text-red-500 text-xs mt-1">{errors.subAreaName}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">City *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-md p-3 text-base bg-gray-100"
//             value={formData.city}
//             editable={false}
//             placeholder="Auto-filled"
//           />
//           {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>}
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-medium text-gray-700 mb-1">State *</Text>
//           <TextInput
//             className="border border-gray-300 rounded-md p-3 text-base bg-gray-100"
//             value={formData.state}
//             editable={false}
//             placeholder="Auto-filled"
//           />
//           {errors.state && <Text className="text-red-500 text-xs mt-1">{errors.state}</Text>}
//         </View>

//         <View className="flex-row items-start mb-4">
//           <TouchableOpacity
//             onPress={() => setAgreedToTerms(!agreedToTerms)}
//             className="mr-2 mt-0.5"
//           >
//             <Text className={checkboxClass}>{agreedToTerms ? "✓" : "☐"}</Text>
//           </TouchableOpacity>
//           <Text className="text-base text-gray-700 flex-1">
//             I agree to the{" "}
//             <TouchableOpacity onPress={openTerms}>
//               <Text className="text-blue-600 font-medium underline">Terms & Conditions</Text>
//             </TouchableOpacity>{" "}
//             *
//           </Text>
//           {errors.terms && <Text className="text-red-500 text-xs mt-1">{errors.terms}</Text>}
//         </View>

//         <TouchableOpacity
//           className={submitButtonClass}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           <Text className="text-white text-base font-semibold">
//             {loading ? "Signing Up..." : "Sign Up"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="items-center mb-2" onPress={navigateToTechnicianSignup}>
//           <Text className="text-sm text-gray-600 text-center">
//             Are you a technician? <Text className="text-blue-600 font-medium underline">Sign Up here</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity className="items-center pb-5" onPress={navigateToLogin}>
//         <Text className="text-sm text-gray-600 text-center">
//           Already Sign up? <Text className="text-blue-600 font-medium underline">Sign In</Text>
//         </Text>
//       </TouchableOpacity>

//       <Modal visible={showTermsModal} onRequestClose={closeTerms} animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center items-center p-5">
//           <View className="absolute top-12 right-5 z-10">
//             <TouchableOpacity onPress={closeTerms} className="p-1">
//               <Text className="text-2xl text-white">×</Text>
//             </TouchableOpacity>
//           </View>
//           <View className="bg-white p-5 rounded-lg w-[90%] max-h-[80%]">
//             <Text className="text-xl font-bold text-center mb-5">Terms & Conditions</Text>
//             <TermsConditionsScreen />
//             <TouchableOpacity onPress={closeTerms} className="bg-blue-600 p-3 rounded items-center mt-5">
//               <Text className="text-white text-base font-medium">Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   contentContainer: {
//     padding: 16,
//   },
// });

// export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
//   Alert,
//   Keyboard,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {
// //   getAllPincodes,
// //   userRegister,
// // } from '@/src/api/apiMethods';
// import { Feather } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { getAllPincodes } from '@/src/api/apiMethods';

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   subAreaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// // Dynamic input fields configuration
// const dynamicInputFields = [
//   {
//     id: 'name' as keyof FormData,
//     label: 'Name',
//     type: 'text',
//     placeholder: 'Enter your full name',
//     keyboardType: 'default' as const,
//     autoCapitalize: 'words' as const,
//     maxLength: undefined,
//     required: true,
//     emoji: '👤',
//     validation: (value: string) => !value.trim() ? 'Name is required' : '',
//   },
//   {
//     id: 'mobile' as keyof FormData,
//     label: 'Phone Number',
//     type: 'tel',
//     placeholder: 'Enter 10-digit phone number',
//     keyboardType: 'phone-pad' as const,
//     autoCapitalize: 'none' as const,
//     maxLength: 10,
//     required: true,
//     emoji: '📞',
//     validation: (value: string) => !value.match(/^[0-9]{10}$/) ? 'Enter a valid 10-digit phone number' : '',
//   },
//   {
//     id: 'password' as keyof FormData,
//     label: 'Password',
//     type: 'password',
//     placeholder: 'Password (6-10 characters)',
//     keyboardType: 'default' as const,
//     autoCapitalize: 'none' as const,
//     maxLength: 10,
//     required: true,
//     emoji: '🔒',
//     validation: (value: string) => value.length < 6 || value.length > 10 ? 'Password must be 6-10 characters' : '',
//   },
//   {
//     id: 'buildingName' as keyof FormData,
//     label: 'House/Building Name',
//     type: 'text',
//     placeholder: 'Enter house or building name',
//     keyboardType: 'default' as const,
//     autoCapitalize: 'words' as const,
//     maxLength: undefined,
//     required: true,
//     emoji: '🏠',
//     validation: (value: string) => !value.trim() ? 'Building name is required' : '',
//   }
// ];

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [activeField, setActiveField] = useState<keyof FormData | null>(null);

//   // Load pincodes data
//   useEffect(() => {
//     const loadPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (error) {
//         console.error('Failed to load pincodes:', error);
//       }
//     };
//     loadPincodes();
//   }, []);

//   // Handle pincode selection
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: found.city || '', 
//           state: found.state || '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: '', 
//           state: '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       }
//       setSubAreaOptions([]);
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ 
//         ...prev, 
//         city: '', 
//         state: '',
//         areaName: '',
//         subAreaName: '' 
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   // Handle area selection
//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     // Validate dynamic fields
//     dynamicInputFields.forEach(field => {
//       const error = field.validation(formData[field.id]);
//       if (error) {
//         newErrors[field.id] = error;
//       }
//     });

//     // Validate other fields
//     if (!formData.areaName) newErrors.areaName = 'Area is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

//     return newErrors;
//   }, [formData]);

//   const handleChange = useCallback((name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'pincode') {
//       setSelectedPincode(value);
//     }
    
//     // Clear error for this field
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const handleFocus = useCallback((field: keyof FormData) => {
//     setActiveField(field);
//   }, []);

//   const handleBlur = useCallback((field: keyof FormData) => {
//     // Validate on blur for dynamic fields
//     if (dynamicInputFields.find(f => f.id === field)) {
//       const fieldConfig = dynamicInputFields.find(f => f.id === field);
//       if (fieldConfig) {
//         const error = fieldConfig.validation(formData[field]);
//         if (error) {
//           setErrors(prev => ({ ...prev, [field]: error }));
//         }
//       }
//     }
//     setActiveField(null);
//   }, [formData]);

//   // Handle keyboard dismiss on scroll
//   const handleScroll = useCallback(() => {
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       Alert.alert('Validation Error', 'Please fix the errors in the form');
//       return;
//     }

//     setLoading(true);
//     setErrors({}); // Clear previous errors
//     Keyboard.dismiss(); // Dismiss keyboard before API call
    
//     try {
//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName || '-',
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       console.log('Registration payload:', basePayload);
      
//       const response = await userRegister(basePayload);
      
//       if (response.success) {
//         Alert.alert('Success', 'Registration completed! Redirecting to login...');
//         navigation.replace('Login');
//       } else {
//         throw new Error(response?.message || 'Registration failed');
//       }
//     } catch (err: any) {
//       const errorMsg = err?.data?.error?.[0] || err?.message || 'Registration failed. Please try again.';
//       setErrors({ ...errors, general: errorMsg });
//       Alert.alert('Registration Error', errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, validateForm, errors, navigation]);

//   const InputField = ({ 
//     id, 
//     label, 
//     type, 
//     value, 
//     onChange, 
//     error, 
//     required = true 
//   }: {
//     id: keyof FormData;
//     label: string;
//     type: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//   }) => {
//     // Get field configuration for dynamic fields
//     const fieldConfig = dynamicInputFields.find(f => f.id === id);
//     const isDynamicField = !!fieldConfig;

//     return (
//       <View className="mb-4">
//         <Text className="text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <Text className="text-red-500">*</Text>}
//         </Text>
        
//         {id === 'password' ? (
//           <View className="relative">
//             <View className={`flex-row items-center border rounded-md p-2 bg-white ${
//               activeField === 'password' ? 'border-blue-500' : 'border-gray-300'
//             }`}>
//               <Text className="text-base mr-2">{fieldConfig?.emoji || '🔒'}</Text>
//               <TextInput
//                 className="flex-1 text-base text-gray-800 pr-10"
//                 placeholder={fieldConfig?.placeholder || "Password (6-10 characters)"}
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry={!showPassword}
//                 editable={!loading}
//                 maxLength={10}
//                 keyboardType={fieldConfig?.keyboardType || 'default'}
//                 autoCapitalize={fieldConfig?.autoCapitalize || 'none'}
//                 onFocus={() => handleFocus('password')}
//                 onBlur={() => handleBlur('password')}
//                 autoCorrect={false}
//               />
//               <Pressable
//                 onPress={() => !loading && setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2"
//                 disabled={loading}
//               >
//                 <Text className="text-lg">
//                   {showPassword ? '🙈' : '👁️'}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         ) : id === 'pincode' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">📍</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Pincode" value="" style={{ fontSize: 11 }} />
//                 {pincodeData
//                   .sort((a, b) => parseInt(a.code) - parseInt(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} style={{ fontSize: 11 }} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'city' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">🏙️</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select City" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.city} value={p.city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'state' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">🌍</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select State" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.state} value={p.state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'areaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">🗺️</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Area" value="" style={{ fontSize: 11 }}  />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'subAreaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">📋</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Sub Area" value="" style={{ fontSize: 11 }}  />
//                 {subAreaOptions
//                   .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                   .map((a) => (
//                     <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : (
//           // Dynamic text input fields
//           <View className={`relative flex-row items-center border rounded-md p-2 bg-white ${
//             activeField === id ? 'border-blue-500 shadow-md' : 'border-gray-300'
//           }`}>
//             <Text className="text-base mr-2">{fieldConfig?.emoji || '📝'}</Text>
//             <TextInput
//               className="flex-1 text-base text-gray-800"
//               placeholder={fieldConfig?.placeholder || label}
//               value={value}
//               onChangeText={onChange}
//               keyboardType={fieldConfig?.keyboardType || 'default'}
//               autoCapitalize={fieldConfig?.autoCapitalize || 'none'}
//               editable={!loading}
//               maxLength={fieldConfig?.maxLength}
//               onFocus={() => handleFocus(id)}
//               onBlur={() => handleBlur(id)}
//               autoCorrect={false}
//               returnKeyType={id === 'buildingName' ? 'next' : 'done'}
//               onSubmitEditing={id === 'buildingName' ? () => {
//                 // Focus on next field or submit
//                 if (!loading) {
//                   const nextField = document.getElementById('pincode-input');
//                   if (nextField) {
//                     (nextField as any).focus();
//                   }
//                 }
//               } : Keyboard.dismiss}
//             />
//             {activeField === id && (
//               <View className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-md" />
//             )}
//           </View>
//         )}
        
//         {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
//       </View>
//     );
//   };

//   return (
//         <ScrollView 
//           contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           bounces={false}
//         >
//           {/* Logo Header */}
//           <View className="flex justify-center mb-6">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center">
//               <Image
//                 source={require('../../../assets/prnv_logo.jpg')}
//                 className="h-14 w-72"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Form Container */}
//           <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
//             <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
//               Sign Up as User
//             </Text>

//             {/* General Error */}
//             {errors.general && (
//               <View className="bg-red-50 p-2 rounded mb-4">
//                 <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
//               </View>
//             )}

//             {/* Dynamic Form Fields */}
//             {dynamicInputFields.map((field) => (
//               <InputField
//                 key={field.id}
//                 id={field.id}
//                 label={field.label}
//                 type={field.type}
//                 value={formData[field.id]}
//                 onChange={(value) => handleChange(field.id, value)}
//                 error={errors[field.id]}
//                 required={field.required}
//               />
//             ))}

//             {/* Static Form Fields */}
//             <InputField
//               id="pincode"
//               label="Pincode"
//               type="text"
//               value={formData.pincode}
//               onChange={(value) => handleChange('pincode', value)}
//               error={errors.pincode}
//               required={true}
//             />

//             <InputField
//               id="areaName"
//               label="Area Name"
//               type="text"
//               value={formData.areaName}
//               onChange={(value) => handleChange('areaName', value)}
//               error={errors.areaName}
//               required={true}
//             />

//             <InputField
//               id="subAreaName"
//               label="Sub Area"
//               type="text"
//               value={formData.subAreaName}
//               onChange={(value) => handleChange('subAreaName', value)}
//               error={undefined}
//               required={false}
//             />

//             <InputField
//               id="city"
//               label="City"
//               type="text"
//               value={formData.city}
//               onChange={(value) => handleChange('city', value)}
//               error={errors.city}
//               required={true}
//             />

//             <InputField
//               id="state"
//               label="State"
//               type="text"
//               value={formData.state}
//               onChange={(value) => handleChange('state', value)}
//               error={errors.state}
//               required={true}
//             />

//             {/* Submit Button */}
//             <View className="pt-4">
//               <TouchableOpacity
//                 className={`w-full py-2 rounded-md items-center ${
//                   loading 
//                     ? 'bg-gray-400' 
//                     : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
//                 }`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//                 activeOpacity={0.7}
//               >
//                 <Text className="text-white font-semibold text-base">
//                   {loading ? 'Signing Up...' : 'Sign Up'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Sign In Link */}
//           <View className="mt-2 text-center">
//             <Text className="text-gray-600 text-sm">
//               Already Sign up?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
//                 <Text className="text-blue-600 font-medium">Sign In</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </ScrollView>
//   );
// };

// export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   getAllPincodes,
//   userRegister,
// } from '@/src/api/apiMethods';
// import { Feather } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   subAreaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   // Load pincodes data
//   useEffect(() => {
//     const loadPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (error) {
//         console.error('Failed to load pincodes:', error);
//       }
//     };
//     loadPincodes();
//   }, []);

//   // Handle pincode selection
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: found.city || '', 
//           state: found.state || '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: '', 
//           state: '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       }
//       setSubAreaOptions([]);
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ 
//         ...prev, 
//         city: '', 
//         state: '',
//         areaName: '',
//         subAreaName: '' 
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   // Handle area selection
//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Enter a valid 10-digit phone number';
//     if (formData.password.length < 6 || formData.password.length > 10) newErrors.password = 'Password must be 6-10 characters';
//     if (!formData.buildingName.trim()) newErrors.buildingName = 'Building name is required';
//     if (!formData.areaName) newErrors.areaName = 'Area is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

//     return newErrors;
//   }, [formData]);

//   const handleChange = useCallback((name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'pincode') {
//       setSelectedPincode(value);
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       Alert.alert('Validation Error', 'Please fix the errors in the form');
//       return;
//     }

//     setLoading(true);
//     setErrors({}); // Clear previous errors
    
//     try {
//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName || '-',
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       console.log('Registration payload:', basePayload);
      
//       const response = await userRegister(basePayload);
      
//       if (response.success) {
        
//         Alert.alert('Success', 'Registration completed! Redirecting to login...');
//         navigation.replace('Login');
//       } else {
//         throw new Error(response?.message || 'Registration failed');
//       }
//     } catch (err: any) {
//       const errorMsg = err?.data?.error?.[0] || err?.message || 'Registration failed. Please try again.';
//       setErrors({ ...errors, general: errorMsg });
//       Alert.alert('Registration Error', errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, validateForm, errors, navigation]);

//   const InputField = ({ 
//     id, 
//     label, 
//     type, 
//     value, 
//     onChange, 
//     error, 
//     required = true 
//   }: {
//     id: keyof FormData;
//     label: string;
//     type: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//   }) => {
//     // Emoji mapping for fields
//     const getEmojiForField = (fieldId: keyof FormData) => {
//       switch (fieldId) {
//         case 'name': return '👤';
//         case 'mobile': return '📞';
//         case 'password': return '🔒';
//         case 'buildingName': return '🏠';
//         case 'pincode': return '📍';
//         case 'city': return '🏙️';
//         case 'state': return '🌍';
//         case 'areaName': return '🗺️';
//         case 'subAreaName': return '📋';
//         default: return '📝';
//       }
//     };

//     return (
//       <View className="mb-4">
//         <Text className="text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <Text className="text-red-500">*</Text>}
//         </Text>
        
//         {id === 'password' ? (
//           <View className="relative">
//             <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <TextInput
//                 className="flex-1 text-base text-gray-800 pr-10"
//                 placeholder="Password (6-10 characters)"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry={!showPassword}
//                 editable={!loading}
//                 maxLength={10}
//               />
//               <Pressable
//                 onPress={() => !loading && setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2"
//                 disabled={loading}
//               >
//                 <Text className="text-lg">
//                   {showPassword ? '🙈' : '👁️'}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         ) : id === 'pincode' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Pincode" value="" style={{ fontSize: 11 }} />
//                 {pincodeData
//                   .sort((a, b) => parseInt(a.code) - parseInt(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} style={{ fontSize: 11 }} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'city' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select City" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.city} value={p.city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'state' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select State" value="" style={{ fontSize: 11 }}  />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     style={{ fontSize: 11 }} 
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.state} value={p.state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'areaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Area" value="" style={{ fontSize: 11 }}  />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'subAreaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Sub Area" value="" style={{ fontSize: 11 }}  />
//                 {subAreaOptions
//                   .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                   .map((a) => (
//                     <Picker.Item key={a._id} label={a.name} value={a.name} style={{ fontSize: 11 }}  />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : (
//           <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//             <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//             <TextInput
//               className="flex-1 text-base text-gray-800"
//               placeholder={label}
//               value={value}
//               onChangeText={onChange}
//               keyboardType={type === 'tel' ? 'phone-pad' : 'default'}
//               autoCapitalize={type === 'text' ? 'words' : 'none'}
//               editable={!loading}
//               maxLength={type === 'tel' ? 10 : undefined}
//             />
//           </View>
//         )}
        
//         {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white py-10">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         <ScrollView 
//           contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Logo Header */}
//           <View className="flex justify-center mb-6">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center">
//               <Image
//                 source={require('../../../assets/prnv_logo.jpg')}
//                 className="h-14 w-72"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Form Container */}
//           <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
//             <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
//               Sign Up as User
//             </Text>

//             {/* General Error */}
//             {errors.general && (
//               <View className="bg-red-50 p-2 rounded mb-4">
//                 <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
//               </View>
//             )}

//             {/* Form Fields */}
//             <InputField
//               id="name"
//               label="Name"
//               type="text"
//               value={formData.name}
//               onChange={(value) => handleChange('name', value)}
//               error={errors.name}
//               required={true}
//             />
            
//             <InputField
//               id="mobile"
//               label="Phone Number"
//               type="tel"
//               value={formData.mobile}
//               onChange={(value) => handleChange('mobile', value)}
//               error={errors.mobile}
//               required={true}
//             />

//             <InputField
//               id="password"
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(value) => handleChange('password', value)}
//               error={errors.password}
//               required={true}
//             />

//             <InputField
//               id="buildingName"
//               label="House/Building Name"
//               type="text"
//               value={formData.buildingName}
//               onChange={(value) => handleChange('buildingName', value)}
//               error={errors.buildingName}
//               required={true}
//             />

//             <InputField
//               id="pincode"
//               label="Pincode"
//               type="text"
//               value={formData.pincode}
//               onChange={(value) => handleChange('pincode', value)}
//               error={errors.pincode}
//               required={true}
//             />

//             <InputField
//               id="areaName"
//               label="Area Name"
//               type="text"
//               value={formData.areaName}
//               onChange={(value) => handleChange('areaName', value)}
//               error={errors.areaName}
//               required={true}
//             />

//             <InputField
//               id="subAreaName"
//               label="Sub Area"
//               type="text"
//               value={formData.subAreaName}
//               onChange={(value) => handleChange('subAreaName', value)}
//               error={undefined}
//               required={false}
//             />

//             <InputField
//               id="city"
//               label="City"
//               type="text"
//               value={formData.city}
//               onChange={(value) => handleChange('city', value)}
//               error={errors.city}
//               required={true}
//             />

//             <InputField
//               id="state"
//               label="State"
//               type="text"
//               value={formData.state}
//               onChange={(value) => handleChange('state', value)}
//               error={errors.state}
//               required={true}
//             />

//             {/* Submit Button */}
//             <View className="pt-4">
//               <TouchableOpacity
//                 className={`w-full py-2 rounded-md items-center ${
//                   loading 
//                     ? 'bg-gray-400' 
//                     : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
//                 }`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 <Text className="text-white font-semibold text-base">
//                   {loading ? 'Signing Up...' : 'Sign Up'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Role Switch Link */}
//           {/* <View className="mt-4 text-center">
//             <Text className="text-gray-600 text-sm">
//               Are you a technician?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('TechnicianRegister')}>
//                 <Text className="text-blue-600 font-medium">Sign Up here</Text>
//               </TouchableOpacity>
//             </Text>
//           </View> */}

//           {/* Sign In Link */}
//           <View className="mt-2 text-center">
//             <Text className="text-gray-600 text-sm">
//               Already Sign up?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
//                 <Text className="text-blue-600 font-medium">Sign In</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   getAllPincodes,
// } from '@/src/api/apiMethods';
// import { Feather } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';

// interface PincodeArea {
//   _id: string;
//   name: string;
//   subAreas: { _id: string; name: string }[];
// }

// interface PincodeData {
//   _id: string;
//   code: string;
//   city: string;
//   state: string;
//   areas: PincodeArea[];
// }

// interface FormData {
//   name: string;
//   mobile: string;
//   password: string;
//   buildingName: string;
//   areaName: string;
//   subAreaName: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// interface FormErrors {
//   name?: string;
//   mobile?: string;
//   password?: string;
//   buildingName?: string;
//   areaName?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   general?: string;
// }

// const initialFormState: FormData = {
//   name: '',
//   mobile: '',
//   password: '',
//   buildingName: '',
//   areaName: '',
//   subAreaName: '',
//   city: '',
//   state: '',
//   pincode: '',
// };

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState<FormData>(initialFormState);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [pincodeData, setPincodeData] = useState<PincodeData[]>([]);
//   const [selectedPincode, setSelectedPincode] = useState<string>('');
//   const [areaOptions, setAreaOptions] = useState<PincodeArea[]>([]);
//   const [subAreaOptions, setSubAreaOptions] = useState<{ _id: string; name: string }[]>([]);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   // Load pincodes data
//   useEffect(() => {
//     const loadPincodes = async () => {
//       try {
//         const response = await getAllPincodes();
//         if (Array.isArray(response?.data)) {
//           setPincodeData(response.data);
//         }
//       } catch (error) {
//         console.error('Failed to load pincodes:', error);
//       }
//     };
//     loadPincodes();
//   }, []);

//   // Handle pincode selection
//   useEffect(() => {
//     if (selectedPincode) {
//       const found = pincodeData.find((p) => p.code === selectedPincode);
//       if (found && found.areas) {
//         setAreaOptions(found.areas);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: found.city || '', 
//           state: found.state || '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       } else {
//         setAreaOptions([]);
//         setFormData((prev) => ({ 
//           ...prev, 
//           city: '', 
//           state: '',
//           areaName: '',
//           subAreaName: '' 
//         }));
//       }
//       setSubAreaOptions([]);
//     } else {
//       setAreaOptions([]);
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ 
//         ...prev, 
//         city: '', 
//         state: '',
//         areaName: '',
//         subAreaName: '' 
//       }));
//     }
//   }, [selectedPincode, pincodeData]);

//   // Handle area selection
//   useEffect(() => {
//     if (formData.areaName) {
//       const selectedArea = areaOptions.find((a) => a.name === formData.areaName);
//       if (selectedArea && selectedArea.subAreas) {
//         setSubAreaOptions(selectedArea.subAreas);
//       } else {
//         setSubAreaOptions([]);
//       }
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     } else {
//       setSubAreaOptions([]);
//       setFormData((prev) => ({ ...prev, subAreaName: '' }));
//     }
//   }, [formData.areaName, areaOptions]);

//   const validateForm = useCallback((): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Enter a valid 10-digit phone number';
//     if (formData.password.length < 6 || formData.password.length > 10) newErrors.password = 'Password must be 6-10 characters';
//     if (!formData.buildingName.trim()) newErrors.buildingName = 'Building name is required';
//     if (!formData.areaName) newErrors.areaName = 'Area is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Pincode must be exactly 6 digits';

//     return newErrors;
//   }, [formData]);

//   const handleChange = useCallback((name: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'pincode') {
//       setSelectedPincode(value);
//     }
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const basePayload = {
//         username: formData.name,
//         phoneNumber: formData.mobile,
//         password: formData.password,
//         buildingName: formData.buildingName,
//         areaName: formData.areaName,
//         subAreaName: formData.subAreaName || '-',
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       };

//       console.log('Registration payload:', basePayload);
      
//       // For demo purposes, simulate success
//       await AsyncStorage.setItem('userRegistration', JSON.stringify(basePayload));
      
//       Alert.alert('Success', 'Registration completed! Redirecting to login...');
//       navigation.replace('Login');
//     } catch (err: any) {
//       const errorMsg = err?.data?.error?.[0] || 'Registration failed. Please try again.';
//       setErrors({ ...errors, general: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, validateForm, errors, navigation]);

//   const InputField = ({ 
//     id, 
//     label, 
//     type, 
//     value, 
//     onChange, 
//     error, 
//     required = true 
//   }: {
//     id: keyof FormData;
//     label: string;
//     type: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//   }) => {
//     // Emoji mapping for fields
//     const getEmojiForField = (fieldId: keyof FormData) => {
//       switch (fieldId) {
//         case 'name': return '👤';
//         case 'mobile': return '📞';
//         case 'password': return '🔒';
//         case 'buildingName': return '🏠';
//         case 'pincode': return '📍';
//         case 'city': return '🏙️';
//         case 'state': return '🌍';
//         case 'areaName': return '🗺️';
//         case 'subAreaName': return '📋';
//         default: return '📝';
//       }
//     };

//     return (
//       <View className="mb-4">
//         <Text className="text-sm font-medium text-gray-700 mb-1">
//           {label} {required && <Text className="text-red-500">*</Text>}
//         </Text>
        
//         {id === 'password' ? (
//           <View className="relative">
//             <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <TextInput
//                 className="flex-1 text-base text-gray-800 pr-10"
//                 placeholder="Password (6-10 characters)"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry={!showPassword}
//                 editable={!loading}
//                 maxLength={10}
//               />
//               <Pressable
//                 onPress={() => !loading && setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2"
//                 disabled={loading}
//               >
//                 <Text className="text-lg">
//                   {showPassword ? '🙈' : '👁️'}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         ) : id === 'pincode' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Pincode" value="" />
//                 {pincodeData
//                   .sort((a, b) => parseInt(a.code) - parseInt(b.code))
//                   .map((p) => (
//                     <Picker.Item key={p._id} label={p.code} value={p.code} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'city' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44  }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select City" value="" />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.city || ''}
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.city} value={p.city} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'state' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {selectedPincode && pincodeData.find((p) => p.code === selectedPincode) ? (
//                   <Picker.Item
//                     label={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                     value={pincodeData.find((p) => p.code === selectedPincode)?.state || ''}
//                   />
//                 ) : (
//                   pincodeData.map((p) => (
//                     <Picker.Item key={p._id} label={p.state} value={p.state} />
//                   ))
//                 )}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'areaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Area" value="" />
//                 {areaOptions.map((a) => (
//                   <Picker.Item key={a._id} label={a.name} value={a.name} />
//                 ))}
//               </Picker>
//             </View>
//           </View>
//         ) : id === 'subAreaName' ? (
//           <View className="border border-gray-300 rounded-md">
//             <View className="flex-row items-center p-2">
//               <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//               <Picker
//                 selectedValue={value}
//                 onValueChange={(itemValue) => onChange(itemValue)}
//                 enabled={!loading}
//                 style={{ flex: 1, height: 44 }}
//                 dropdownIconColor="#6b7280"
//                 mode="dropdown"
//               >
//                 <Picker.Item label="Select Sub Area" value="" />
//                 {subAreaOptions
//                   .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
//                   .map((a) => (
//                     <Picker.Item key={a._id} label={a.name} value={a.name} />
//                   ))}
//               </Picker>
//             </View>
//           </View>
//         ) : (
//           <View className="flex-row items-center border border-gray-300 rounded-md p-2 bg-white">
//             <Text className="text-base mr-2">{getEmojiForField(id)}</Text>
//             <TextInput
//               className="flex-1 text-base text-gray-800"
//               placeholder={label}
//               value={value}
//               onChangeText={onChange}
//               keyboardType={type === 'tel' ? 'phone-pad' : 'default'}
//               autoCapitalize={type === 'text' ? 'words' : 'none'}
//               editable={!loading}
//               maxLength={type === 'tel' ? 10 : undefined}
//             />
//           </View>
//         )}
        
//         {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         <ScrollView 
//           contentContainerClassName="px-4 sm:px-6 lg:px-8 py-8"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Logo Header */}
//           <View className="flex justify-center mb-6">
//             <View className="bg-blue-900 rounded px-1 py-1 self-center w-fit">
//               <Image
//                 source={require('../../../assets/prnv_logo.jpg')}
//                 className="h-8 w-auto"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Form Container */}
//           <View className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
//             <Text className="text-2xl font-semibold mb-6 text-center capitalize text-gray-800">
//               Sign Up as User
//             </Text>

//             {/* General Error */}
//             {errors.general && (
//               <View className="bg-red-50 p-2 rounded mb-4">
//                 <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
//               </View>
//             )}

//             {/* Form Fields */}
//             <InputField
//               id="name"
//               label="Name"
//               type="text"
//               value={formData.name}
//               onChange={(value) => handleChange('name', value)}
//               error={errors.name}
//               required={true}
//             />
            
//             <InputField
//               id="mobile"
//               label="Phone Number"
//               type="tel"
//               value={formData.mobile}
//               onChange={(value) => handleChange('mobile', value)}
//               error={errors.mobile}
//               required={true}
//             />

//             <InputField
//               id="password"
//               label="Password"
//               type="password"
//               value={formData.password}
//               onChange={(value) => handleChange('password', value)}
//               error={errors.password}
//               required={true}
//             />

//             <InputField
//               id="buildingName"
//               label="House/Building Name"
//               type="text"
//               value={formData.buildingName}
//               onChange={(value) => handleChange('buildingName', value)}
//               error={errors.buildingName}
//               required={true}
//             />

//             <InputField
//               id="pincode"
//               label="Pincode"
//               type="text"
//               value={formData.pincode}
//               onChange={(value) => handleChange('pincode', value)}
//               error={errors.pincode}
//               required={true}
//             />

//             <InputField
//               id="areaName"
//               label="Area Name"
//               type="text"
//               value={formData.areaName}
//               onChange={(value) => handleChange('areaName', value)}
//               error={errors.areaName}
//               required={true}
//             />

//             <InputField
//               id="subAreaName"
//               label="Sub Area"
//               type="text"
//               value={formData.subAreaName}
//               onChange={(value) => handleChange('subAreaName', value)}
//               error={undefined}
//               required={false}
//             />

//             <InputField
//               id="city"
//               label="City"
//               type="text"
//               value={formData.city}
//               onChange={(value) => handleChange('city', value)}
//               error={errors.city}
//               required={true}
//             />

//             <InputField
//               id="state"
//               label="State"
//               type="text"
//               value={formData.state}
//               onChange={(value) => handleChange('state', value)}
//               error={errors.state}
//               required={true}
//             />

//             {/* Submit Button */}
//             <View className="pt-4">
//               <TouchableOpacity
//                 className={`w-full py-2 rounded-md items-center ${
//                   loading 
//                     ? 'bg-gray-400' 
//                     : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
//                 }`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 <Text className="text-white font-semibold text-base">
//                   {loading ? 'Signing Up...' : 'Sign Up'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Role Switch Link */}
//           <View className="mt-4 text-center">
//             <Text className="text-gray-600 text-sm">
//               Are you a technician?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('TechnicianRegister')}>
//                 <Text className="text-blue-600 font-medium">Sign Up here</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>

//           {/* Sign In Link */}
//           <View className="mt-2 text-center">
//             <Text className="text-gray-600 text-sm">
//               Already Sign up?{' '}
//               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                 <Text className="text-blue-600 font-medium">Sign In</Text>
//               </TouchableOpacity>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: 'https://img.icons8.com/color/96/000000/maintenance.png' }} style={styles.logo} />
//       <Text style={styles.title}>Create Account</Text>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>👤</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>✉️</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>📞</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Phone"
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.icon}>🔒</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>
//       <TouchableOpacity
//         style={styles.signInButton}
//         onPress={() => navigation.replace('MainTabs')}
//       >
//         <Text style={styles.signInButtonText}>Register</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text style={styles.signupLink}>Back to Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     alignSelf: 'center',
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 32,
//     color: '#a259ff',
//     textAlign: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     marginBottom: 18,
//     height: 56,
//   },
//   icon: {
//     fontSize: 20,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#222',
//   },
//   signInButton: {
//     backgroundColor: '#a259ff',
//     borderRadius: 32,
//     paddingVertical: 18,
//     alignItems: 'center',
//     marginBottom: 18,
//     shadowColor: '#a259ff',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//     elevation: 4,
//   },
//   signInButtonText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   signupLink: {
//     color: '#a259ff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: 'bold',
//   },
// }); 