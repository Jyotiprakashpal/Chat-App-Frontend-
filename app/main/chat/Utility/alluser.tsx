import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../../context/Authcontext";
import { ENDPOINTS } from "../../../services/api/endpoints";
import API from "../../../services/api/method";

interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
}

interface AllUserModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AllUserModal({ visible, onClose }: AllUserModalProps) {
  const router = useRouter();
  const { user: authUser } = React.useContext(AuthContext);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      console.log("Fetching users...");
      const res = await API.get(ENDPOINTS.USER.GET_USERS);
      console.log("Users response:", res);
      
      let usersList = [];
      if (Array.isArray(res)) {
        usersList = res;
      } else if (res && Array.isArray(res.data)) {
        usersList = res.data;
      } else if (res && Array.isArray(res.users)) {
        usersList = res.users;
      }
      
      console.log("Users list before filter:", usersList);
      
      const normalizedUsers = usersList.map((user: User) => ({
        ...user,
        name: user.name || user.username || "",
      }));
      
      const filteredUsers = normalizedUsers.filter(
        (user: User) => user.email !== authUser?.email
      );
      console.log("Filtered users:", filteredUsers);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAllUsers();
    }
  }, [visible]);

  const handleUserSelect = (user: User) => {
    onClose();
    router.push({
      pathname: "/main/chat/[id]",
      params: { id: user._id || user.email },
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.usersModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.usersModalContent}>
          <View style={styles.usersModalHeader}>
            <Text style={styles.usersModalTitle}>New Chat</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {loadingUsers ? (
            <View style={styles.usersLoader}>
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : allUsers.length === 0 ? (
            <View style={styles.noUsersContainer}>
              <Text style={styles.noUsersText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={allUsers}
              keyExtractor={(item) => item._id || item.email}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.userItem}
                  onPress={() => handleUserSelect(item)}
                >
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {item.name?.charAt(0).toUpperCase() || "?"}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name || "Unknown"}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                  <Ionicons name="chatbubble-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  usersModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  usersModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 30,
  },
  usersModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  usersModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  usersLoader: {
    padding: 50,
    alignItems: "center",
  },
  noUsersContainer: {
    padding: 50,
    alignItems: "center",
  },
  noUsersText: {
    fontSize: 16,
    color: "#64748B",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  userAvatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
});
