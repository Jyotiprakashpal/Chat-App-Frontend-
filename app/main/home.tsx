import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { AuthContext } from "../context/Authcontext";
import API from "../services/api/method";
import AllUserModal from "./chat/Utility/alluser";
import Menu from "./chat/Utility/menu";

interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
}

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  status?: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: {
    text: string;
    sender: string;
    createdAt: string;
  };
  updatedAt: string;
}

export default function Home() {
  const router = useRouter();
  const { logout, user: authUser } = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const isTabletOrWeb = width >= 768;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [profileMenuVisible, setProfileMenuVisible] = useState<boolean>(false);

  const [usersModalVisible, setUsersModalVisible] = useState<boolean>(false);
  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p.email !== authUser?.email
      );
      const name = otherParticipant?.name?.toLowerCase() || otherParticipant?.username?.toLowerCase() || "";
      const email = otherParticipant?.email?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      
      return name.includes(searchLower) || email.includes(searchLower);
    });
    setFilteredConversations(filtered);
  }, [search, conversations, authUser?.email]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await API.get("/auth/me");
      setCurrentUser(userData);
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await API.get("/messages/conversations");
      setConversations(res.data || res || []);
      setFilteredConversations(res.data || res || []);
    } catch (error) {
      console.log("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setProfileMenuVisible(false);
    await logout();
    router.replace("/auth");
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(
      (p) => p.email !== authUser?.email
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherParticipant(item);
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          router.push({
            pathname: "/main/chat/[id]",
            params: { id: otherUser?._id || otherUser?.email },
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {otherUser?.name?.charAt(0).toUpperCase() || "?"}
          </Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{otherUser?.name || "Unknown"}</Text>
            {item.lastMessage && (
              <Text style={styles.time}>
                {formatTime(item.lastMessage.createdAt || item.updatedAt)}
              </Text>
            )}
          </View>
          {item.lastMessage ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage.sender === authUser?.email ? "You: " : ""}
              {item.lastMessage.text}
            </Text>
          ) : (
            <Text style={styles.lastMessage}>No messages yet</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isTabletOrWeb && styles.containerLarge,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.hamburgerButton}
          onPress={() => setProfileMenuVisible(true)}
        >
          <Ionicons name="menu-outline" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Chats</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          placeholder="Search chats..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start chatting with someone!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id || item.participants[0]?._id || String(Math.random())}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setUsersModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={32} color="#fff" />
      </TouchableOpacity>

      <Menu
        visible={profileMenuVisible}
        currentUser={currentUser}
        onClose={() => setProfileMenuVisible(false)}
        onLogout={handleLogout}
      />

      <AllUserModal
        visible={usersModalVisible}
        onClose={() => setUsersModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  containerLarge: {
    alignSelf: "stretch",
    width: "100%",
    maxWidth: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 36,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
  },
  time: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  lastMessage: {
    fontSize: 14,
    color: "#64748B",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#64748B",
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 50,
    paddingRight: 16,
  },
  profileMenu: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 300,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  profileHeader: {
    backgroundColor: "#4F46E5",
    padding: 24,
    alignItems: "center",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileAvatarText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 32,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  profileStatus: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  logoutText: {
    color: "#EF4444",
  },
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
