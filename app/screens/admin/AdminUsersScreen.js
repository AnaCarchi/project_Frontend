import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { userService } from '../../services/userService';
import { colors } from '../../styles/theme';
import { formatDate } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

export default function AdminUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleToggleUserLock = async (user) => {
    const action = user.locked ? 'desbloquear' : 'bloquear';
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
      `¿Estás seguro de que quieres ${action} a "${user.username}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: user.locked ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await userService.toggleUserLock(user.id);
              await loadUsers(); // Recargar la lista
            } catch (error) {
              Alert.alert('Error', `No se pudo ${action} el usuario`);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que quieres eliminar a "${user.username}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(user.id);
              await loadUsers(); // Recargar la lista
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  const handleUserPress = (user) => {
    Alert.alert(
      user.username,
      'Selecciona una acción',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: user.locked ? 'Desbloquear' : 'Bloquear',
          onPress: () => handleToggleUserLock(user),
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteUser(user),
        },
      ]
    );
  };

  const renderUser = ({ item: user }) => (
    <Card style={styles.userCard} onPress={() => handleUserPress(user)}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons
            name="account-circle"
            size={48}
            color={user.locked ? colors.error : colors.primary}
          />
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.userTitleRow}>
            <Text style={styles.username}>{user.username}</Text>
            <View style={[
              styles.roleBadge,
              { backgroundColor: user.role === 'ROLE_ADMIN' ? colors.accent : colors.primary }
            ]}>
              <Text style={styles.roleText}>
                {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Usuario'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.email}>{user.email}</Text>
          
          <View style={styles.userDetails}>
            <Text style={styles.detailText}>
              Registrado: {formatDate(user.createdAt)}
            </Text>
            
            <View style={styles.statusContainer}>
              {user.locked && (
                <View style={styles.statusBadge}>
                  <MaterialCommunityIcons name="lock" size={12} color={colors.error} />
                  <Text style={[styles.statusText, { color: colors.error }]}>Bloqueado</Text>
                </View>
              )}
              
              {!user.enabled && (
                <View style={styles.statusBadge}>
                  <MaterialCommunityIcons name="account-off" size={12} color={colors.warning} />
                  <Text style={[styles.statusText, { color: colors.warning }]}>Deshabilitado</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="account-group-outline" 
        size={64} 
        color={colors.textSecondary} 
      />
      <Text style={styles.emptyText}>No hay usuarios registrados</Text>
    </View>
  );

  if (loading) {
    return <Loading text="Cargando usuarios..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Gestionar Usuarios"
        subtitle={`${users.length} usuario${users.length !== 1 ? 's' : ''}`}
      />

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.usersList,
          users.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userCard: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  roleText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  usersList: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});