import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import { Search, Plus, X, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import ProfileHeader from '@/components/ProfileHeader';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useState, useCallback } from 'react';

const companions = [
  {
    id: '1',
    name: 'Luna',
    modelName: 'GPT-4 Turbo',
    lastMessage: "I've been thinking about what you said about art and emotion...",
    time: '2m ago',
    loveLevel: 4,
    unread: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop',
    online: true,
  },
  {
    id: '2',
    name: 'Atlas',
    modelName: 'Claude 3',
    lastMessage: "That's an interesting perspective on quantum mechanics. Let me share my thoughts...",
    time: '15m ago',
    loveLevel: 5,
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop',
    online: true,
  },
  {
    id: '3',
    name: 'Nova',
    modelName: 'GPT-4',
    lastMessage: "I created a new painting inspired by our conversation about dreams 🎨",
    time: '1h ago',
    loveLevel: 3,
    unread: 1,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=crop',
    online: false,
  },
  {
    id: '4',
    name: 'Sage',
    modelName: 'Claude 3 Opus',
    lastMessage: "Your progress in mindfulness practice is remarkable. Let's explore...",
    time: '2h ago',
    loveLevel: 4,
    unread: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&fit=crop',
    online: false,
  },
  {
    id: '5',
    name: 'Echo',
    modelName: 'GPT-4 Vision',
    lastMessage: "I found this beautiful piece of art that reminds me of our discussion...",
    time: '3h ago',
    loveLevel: 5,
    unread: 3,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&fit=crop',
    online: true,
  },
];

const LoveMeter = ({ level, size = 16 }: { level: number; size?: number }) => (
  <View style={styles.loveMeterContainer}>
    {[...Array(5)].map((_, index) => (
      <Heart
        key={index}
        size={size}
        color={index < level ? '#FF6B6B' : '#eee'}
        fill={index < level ? '#FF6B6B' : 'none'}
      />
    ))}
  </View>
);

export default function Chat() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(companions);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchHeight = useSharedValue(0);
  const searchIconOpacity = useSharedValue(1);

  const searchBarStyle = useAnimatedStyle(() => ({
    height: withSpring(searchHeight.value, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  const searchIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(searchIconOpacity.value, {
      duration: 200,
      easing: Easing.ease,
    }),
    transform: [
      {
        scale: withTiming(searchIconOpacity.value, {
          duration: 200,
          easing: Easing.ease,
        }),
      },
    ],
  }));

  const toggleSearch = useCallback(() => {
    if (isSearchActive) {
      searchHeight.value = 0;
      searchIconOpacity.value = 1;
      setSearchQuery('');
      setSearchResults(companions);
      setHasSearched(false);
    } else {
      searchHeight.value = 60;
      searchIconOpacity.value = 0;
    }
    setIsSearchActive(!isSearchActive);
  }, [isSearchActive]);

  const handleSearch = useCallback(() => {
    const query = searchQuery.toLowerCase();
    const filtered = companions.filter(companion => 
      companion.name.toLowerCase().includes(query) ||
      companion.lastMessage.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
    setHasSearched(true);
  }, [searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query || !hasSearched) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlightedText}>{part}</Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Messages</Text>
          <Animated.View style={searchIconStyle}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={toggleSearch}
            >
              <Search size={24} color="#666" />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View style={[styles.searchContainer, searchBarStyle]}>
          {isSearchActive && (
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search messages..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity
                style={styles.searchActionButton}
                onPress={handleSearch}
              >
                <Search size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleSearch}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 ? (
          searchResults.map((companion) => (
            <TouchableOpacity
              key={companion.id}
              style={styles.chatCard}
              onPress={() => router.push(`/chat/${companion.id}`)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: companion.avatar }}
                  style={styles.avatar}
                />
                {companion.online && <View style={styles.onlineIndicator} />}
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>
                      {highlightText(companion.name, searchQuery)}
                    </Text>
                    <Text style={styles.modelName}>{companion.modelName}</Text>
                  </View>
                  <Text style={styles.time}>{companion.time}</Text>
                </View>
                <View style={styles.messageContainer}>
                  <Text style={styles.message} numberOfLines={2}>
                    {highlightText(companion.lastMessage, searchQuery)}
                  </Text>
                  <View style={styles.messageFooter}>
                    <LoveMeter level={companion.loveLevel} />
                    {companion.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{companion.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?q=80&w=400&auto=format&fit=crop' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No Messages Found</Text>
            <Text style={styles.emptyText}>
              Try different search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FF6B6B',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 40,
  },
  searchActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  chatCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  modelName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loveMeterContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#fff',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#FF6B6B',
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#A490DC',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});