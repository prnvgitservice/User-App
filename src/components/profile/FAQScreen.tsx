import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline"; 

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [faqs] = useState<FAQItem[]>([
    {
      question: "What is the toll-free number for PRNV Services?",
      answer:
        '"PRNV Services" is an advertisement portal connecting professionals (technicians/service providers) and customers. The professional (technician/service provider) and customer can contact each other through mobile phone and chat. All the problems will be sorted between professionals (technicians/service providers) and customers on their own. Because of this "PRNV Services" doesn’t require any toll-free number. So, whatever the problem is, a professional (technician/service provider) and customer can talk to each other, as we are connecting them through our platform. But in case you have any queries for us then feel free to contact us at +91 96035 58369, +91 9059789177. You can also chat with us or send us an email at prnvservices@gmail.com and we will respond right away.',
    },
    {
      question: "Does PRNV Services provide work Guarantee for the customer?",
      answer:
        'Other companies are taking the amount directly from customers. In this amount, the major share will be retained by companies and the minor share to the professionals (technicians/service providers). With this huge amount, they can give a toll-free number, call center, guarantee, and special offers. Whereas in "PRNV Services", we are connecting professionals (technicians/service providers) and customers and we won’t take anything from professionals in work amount. Because of this "PRNV Services" doesn’t provide any toll-free number, call center, guarantee, and special offers. For security purposes, "PRNV Services" obtained an agreement with the professionals to give a work guarantee of 1 week to customers...',
    },
    {
      question: "What ratio of commission does PRNV Services charge from professionals?",
      answer:
        '"PRNV Services" doesn’t charge any commission from the professional, as we are following the slogan "No Commission from Professionals & Customers". We only take the subscription plan amount.',
    },
    // ... Add the rest of your FAQ items here
  ]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 py-12 px-4">
      <View className="max-w-4xl mx-auto">
        <Text className="text-4xl font-bold text-center text-gray-900 mb-10">
          Frequently Asked Questions
        </Text>

        <View className="space-y-4">
          {faqs.map((faq, index) => (
            <View
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <TouchableOpacity
                onPress={() => toggleFAQ(index)}
                className="w-full flex-row justify-between items-center p-4"
              >
                <Text className="text-md font-medium text-gray-800 flex-1">
                  {index + 1}. {faq.question}
                </Text>
                <ChevronDownIcon
                  size={20}
                  color="gray"
                  className={openIndex === index ? "rotate-180" : ""}
                />
              </TouchableOpacity>
              {openIndex === index && (
                <View className="p-4 pt-0 border-t border-gray-200">
                  <Text className="text-sm text-gray-600">{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FAQ;
