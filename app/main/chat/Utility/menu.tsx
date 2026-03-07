import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Profile from "../../profile";

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  status?: string;
}

interface MenuProps {
  visible: boolean;
  currentUser: CurrentUser | null;
  onClose: () => void;
  onLogout: () => void;
}

interface MenuItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  iconColor?: string;
  textColor?: string;
}

function MenuItem({ icon, label, onPress, showArrow = false, iconColor = "#1E293B", textColor = "#1E293B" }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <Text style={[styles.menuItemText, { color: textColor }]}>{label}</Text>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" style={styles.menuArrow} />
      )}
    </TouchableOpacity>
  );
}

export default function Menu({ visible, currentUser, onClose, onLogout }: MenuProps) {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);

  const handleNewGroup = () => {
    onClose();
    router.push("/main/chat/newgroup");
  };

  const handleNewBroadcast = () => {
    onClose();
    router.push("/main/chat/newbroadcast");
  };

  const handleLinkedDevices = () => {
    onClose();
    Alert.alert("Linked Devices", "This feature will be available soon!");
  };

  const handleStarredMessages = () => {
    onClose();
    router.push("/main/chat/starred");
  };

  const handleProfile = () => {
    setShowProfile(true);
  };

  const handleSettings = () => {
    onClose();
    // Note: /main/settings route doesn't exist yet
    Alert.alert("Settings", "Settings page will be available soon!");
  };

  const handleBackToMenu = () => {
    setShowProfile(false);
  };

  const handleCloseMenu = () => {
    setShowProfile(false);
    onClose();
  };

  // Render Profile component inline
  if (showProfile) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseMenu}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToMenu}
            >
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Profile />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sidebarMenu}>
          {/* Profile Header - WhatsApp Green Theme */}
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={styles.profileName}>
              {currentUser?.name || "User"}
            </Text>
            <Text style={styles.profileEmail}>
              {currentUser?.email || "user@example.com"}
            </Text>
            {currentUser?.status && (
              <Text style={styles.profileStatus}>
                {currentUser.status}
              </Text>
            )}
          </View>

          {/* Menu Items - WhatsApp Style */}
          <View style={styles.menuItems}>
            <MenuItem 
              icon="people-outline" 
              label="New Group" 
              onPress={handleNewGroup}
            />
            
            <MenuItem 
              icon="megaphone-outline" 
              label="New Broadcast" 
              onPress={handleNewBroadcast}
            />
            
            <MenuItem 
              icon="laptop-outline" 
              label="Linked Devices" 
              onPress={handleLinkedDevices}
            />
            
            <MenuItem 
              icon="star-outline" 
              label="Starred Messages" 
              onPress={handleStarredMessages}
              showArrow
            />
            
            <View style={styles.divider} />
            
            <MenuItem 
              icon="settings-outline" 
              label="Settings" 
              onPress={handleSettings}
              showArrow
            />
            
            <MenuItem 
              icon="person-outline" 
              label="Profile" 
              onPress={handleProfile}
            />
            
            <View style={styles.divider} />
            
            <MenuItem 
              icon="log-out-outline" 
              label="Logout" 
              onPress={onLogout}
              iconColor="#EF4444"
              textColor="#EF4444"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 50,
    paddingLeft: 0,
  },
  sidebarMenu: {
    backgroundColor: "#fff",
    width: 320,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  profileHeader: {
    backgroundColor: "#008069",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatarText: {
    color: "#008069",
    fontWeight: "700",
    fontSize: 24,
  },
  profileName: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "500",
    marginBottom: 2,
  },
  profileEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  profileStatus: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  menuItems: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  menuArrow: {
    marginLeft: "auto",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  profileModalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  profileModalContent: {
    flex: 1,
  },
  backButton: {
    padding: 16,
    zIndex: 1,
  },
});
