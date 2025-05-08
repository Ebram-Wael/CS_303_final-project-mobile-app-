import { useRouter } from "expo-router";
import React, { useEffect, useState ,useRef ,ReactNode } from "react";
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "@/components/colors";
import { useThemes } from '@/components/themeContext';

const apiKey = "AIzaSyCLiJ4ok_zmtWFO0SRrNHfdZTakFFBx0rQ";
type message ={
    role : 'user'| 'bot';
    content : string | ReactNode;
}



export default function chat(){
    const router = useRouter();

const [input , setInput] = useState("");
const [messages , setMessages] = useState<message[]>([]);
const [loading , setLoading] = useState(false);
const scrollViewRef = useRef<ScrollView>(null);
const [hasTyped, setHasTyped] = useState(false);
 const { theme } = useThemes();
    const isDark = theme === 'dark';

useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
}, [messages]);


  useEffect(() => {
  
    setTimeout(() => {
      setMessages([
        {
          role: 'bot',
          content: 'Welcome!\nHow can I help you today?'},
      ]);
    }, 1000); 
  }, []);

    async function handleSend() {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");
        setLoading(true);

        try {
            const messagein = input.toLowerCase();
            if (messagein.includes("password") || messagein.includes("reset password")) {
                setTimeout(() => {
                    setMessages((prev) => [...prev, { role: "bot", content: `to reset password \n1 . Go to profile \n2 .Select Change Password  \n3. Follow the instructions` }]);
                    setLoading(false);
                }, 2000);
            }
            else if (messagein.includes("human")) {
                setTimeout(() => {
                    setMessages((prev) => [...prev, { role: "bot", content: `You can contact support:\n1. Visit the "Help" setting\n2. Select "Contact Support"\n3. Choose your apartment seller'  ` }]);
                    setLoading(false);
                }, 2000);
            }
            else if(messagein.includes("hi") || messagein.includes("hello") || messagein.includes("hey")) {
                setTimeout(() => {
                    setMessages((prev) => [...prev, { role: "bot", content: `Hello! How can I help you today?` }]);
                    setLoading(false);
                }, 2000);
            }
            else if(messagein.includes("location") || messagein.includes("price") || messagein.includes("bedrooms") || messagein.includes("university")|| messagein.includes("nearest") ||messagein.includes ("near") ){
              await new Promise(resolve => setTimeout(resolve, 1500));
              const givenToAi =`you are a helpful assistant that helps users to filter Apartment with any of these fields : 
              location ,price ,number of bedrooms and nearest or near by or near to or near to university 
              Return your response in a JSON format with the following:
              {
                "location": "",
                "price": ,
                "bedrooms": ,
                "nearby": ""
              }
              user input: ${input}`;
              

              //old one it has a limit per day
              //https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
              const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        { text: givenToAi }
                      ]
                    }
                  ]
                })
              });
              setLoading(false);
              
              const data = await response.json();
              console.log("response from AI", data);
              const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                try {
                  const clean = text.replace(/```json|```/g, "").trim();
                  const jsonString = clean.replace(/\n/g, "").trim();
                  
                  const filter = JSON.parse(jsonString);
                  
                 
                  console.log("filter", filter);
                  generateLink(filter);
                } catch (e) {
                  setMessages((prev) => [...prev, { 
                    role: "bot", 
                    content: "Sorry, I couldn't process your request. Please rephrase." 
                  }]);
                  console.error("Error parsing AI response:", e, "Raw text:", text);
                }
              } else {
                setMessages((prev) => [...prev, { 
                  role: "bot", 
                  content: "No response from AI." 
                }]);
              }
             
                
            }
            else if(messagein.includes("apartment") || messagein.includes("unit") || messagein.includes("room") || messagein.includes("house") || messagein.includes("flat") && messagein.includes("find") || messagein.includes("search") || messagein.includes("looking") || messagein.includes("help") ){
              setTimeout(() => {
                  setMessages((prev) => [...prev, { role: "bot", content: `I can help you to get  an Apartment with specific type` }]);
                  setLoading(false);
              }, 2000);
             
            }
            else if(messagein.includes("help") || messagein.includes("support") || messagein.includes("assistance")){
              setTimeout(() => {
                  setMessages((prev) => [...prev, { role: "bot", content: `You can contact support:\n1. Visit the "Help" setting\n2. Select "Contact Support"\n3. Choose your apartment seller'  ` }]);
                  setLoading(false);
              }, 2000);
            }
            else {
                setTimeout(() => {
                    setMessages((prev) => [...prev, { role: "bot", content: `Sorry, I don't support this type of question\n I can help you to get apartment with specific type` }]);
                    setLoading(false);
                }, 2000);
            }

        } catch (error) {
            setMessages((prev) => [...prev, { role: "bot", content: 'Sorry, I encountered an error. Please try again' }]);
            setLoading(false);
        }
    }
    type filtered = {
      location?: string;
      price?: number;
      bedrooms?: number;
      nearby?: string;
      [key: string]: any; 
    } 

    
 

    const generateLink =(filter :filtered)=>{
        const { location, price, bedrooms ,nearby } = filter;

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: `Here is the link to explore apartments with your preference` },
            ]);
        }, 1000);
        
        
        setTimeout(() => {

        setMessages((prev) => [
            ...prev,
            { role: "bot", content: (
                <Pressable onPress={() => 
                    router.push({
                        pathname :'../(drawer)/(tabs)/explore',
                        params: {
                            location: location,
                            price: price,
                            bedrooms: bedrooms,
                            nearby: nearby,
                        }
                    })
                }>
                    <Text style={{color:isDark?Colors.darkModeText:Colors.text ,textDecorationLine :'underline'}} >Click here</Text>
                </Pressable>
            ) },
        ]);
        }, 2000);

        setLoading(false);
    }


return (
    <View style={[styles.container,{backgroundColor:isDark?Colors.darkModeBackground:Colors.background}]}>
      <View style={[styles.header,{backgroundColor:isDark?Colors.darkModePrimary:Colors.primary}]}>
        <Text style={styles.headerText}> Chat bot </Text>
      </View>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.bubble,
              msg.role === 'user' ? 
             [ styles.userBubble ,{backgroundColor:isDark?Colors.assestGreenThree:Colors.assestGreenTwo}]
              : 
             [ styles.botBubble,{backgroundColor:isDark?Colors.assestGreenTwo:Colors.assestGreenThree}],
            ]}
          >
            <Text style={msg.role === 'user' ? 
              [styles.userText,{color:isDark?Colors.text:Colors.darkModeText}]
              :
               [styles.botText,{color:isDark?Colors.darkModeText:Colors.text}]}>
              {msg.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.bubble, styles.botBubble,{backgroundColor:isDark?Colors.assestGreenTwo:Colors.assestGreenThree}]}>
            <ActivityIndicator size="small" color={isDark?Colors.darkIndicator:Colors.indicator} />
            <Text style={[styles.typingText,{color:isDark?Colors.darkModeText:Colors.text}]}>Typing...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.inputCont,{backgroundColor:isDark?Colors.darkModeBackground:Colors.background}]}>
        <TextInput
          value={input}
          onChangeText={(text)=>{
            setInput(text);
            (text.length > 0) ? setHasTyped(false) : setHasTyped(false);
          }}
          placeholder="Type your message..."
          style={[styles.input,
            {backgroundColor:isDark?Colors.darkModePrimary:Colors.primary,
              color:isDark?Colors.darkModeText:Colors.darkModeText
            }]}
          
          multiline
          onSubmitEditing={handleSend}
        />
        <Pressable 
          style={[styles.sendButton,{backgroundColor:isDark?Colors.darkModePrimary:Colors.primary}]} 
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={[styles.sendButtonText,{color:isDark?Colors.darkModeText:Colors.darkModeText}]}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom:20,
    marginHorizontal:0,

  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4DA674',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF8E7',
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: 'black',
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    marginHorizontal:5
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    maxHeight: 70,
    width: '70%',
  },
  sendButton: {
    backgroundColor: '#023336',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width:'30%'
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  quickButton: {
    backgroundColor: '#C1E6BA',
    padding: 10,
    borderRadius: 20,
    width: '30%',
    height:40,
    alignItems: 'center',
    
  },
  quickButtonText: {
    color: '#023336',
    fontWeight: '500',
  },
  header:{
    backgroundColor:'#023336',
    fontSize:20,
    fontWeight:'bold',
    height:50,
    margin: 0,
    padding:0,
  },
  headerText:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    paddingTop:10,
  }
});
