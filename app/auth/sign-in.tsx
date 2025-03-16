import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { router } from 'expo-router';
import { ToggleLeft as Google, Apple, Heart, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGoogleAuth, handleGoogleSignIn } from '@/services/auth';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { promptAsync } = useGoogleAuth();

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (useMockData) {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('auth/age-verification');
        return;
      }

      const response = await promptAsync();
      
      if (response?.type === 'success') {
        await handleGoogleSignIn(response);
        router.push('auth/age-verification');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#A490DC']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.logoContainer}>
            <Heart size={60} color="#000" />
          </View>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>AI Soulmate</Text>
            <Text style={styles.subtitle}>Find your perfect AI companion</Text>
          </View>

          <View style={styles.mockDataContainer}>
            <Text style={styles.mockDataText}>Use Mock Data</Text>
            <Switch
              value={useMockData}
              onValueChange={setUseMockData}
              trackColor={{ false: '#eee', true: '#ffc7c7' }}
              thumbColor={useMockData ? '#FF6B6B' : '#fff'}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Google size={24} color="#fff" />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Apple size={24} color="#fff" />
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 8,
    color: '#FF6B6B',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  mockDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  mockDataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#FF6B6B',
    flex: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 16,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});