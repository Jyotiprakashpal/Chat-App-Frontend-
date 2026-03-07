import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/Authcontext";

interface ProfileProps {
  // Optional - can be passed from parent or use AuthContext
}

export default function Profile({}: ProfileProps) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.log("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No user logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name || "User"}</Text>
        <Text style={styles.userEmail}>{user.email || "user@example.com"}</Text>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionIcon}>
            <Ionicons name="person-outline" size={22} color="#1E293B" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Name</Text>
            <Text style={styles.optionValue}>{user.name || "Not set"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionIcon}>
            <Ionicons name="mail-outline" size={22} color="#1E293B" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Email</Text>
            <Text style={styles.optionValue}>{user.email || "Not set"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={styles.optionIcon}>
            <Ionicons name="key-outline" size={22} color="#1E293B" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>User ID</Text>
            <Text style={styles.optionValue} numberOfLines={1}>
              {user._id || "Not set"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.optionItem}
          onPress={handleLogout}
        >
          <View style={[styles.optionIcon, styles.logoutIcon]}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionLabel, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Chat App</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  noUserText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 50,
  },
  profileHeader: {
    backgroundColor: "#008069",
    padding: 30,
    paddingTop: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    color: "#008069",
    fontWeight: "700",
    fontSize: 40,
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logoutIcon: {
    backgroundColor: "#FEE2E2",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  optionValue: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  appInfo: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  appName: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  appVersion: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
});
