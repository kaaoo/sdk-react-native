import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendReferral } from '../api/apiMutations';

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else return null;
  } catch (e) {
    return null;
  }
};

export const clearReferralSession = async () => {
  try {
    if (await getData('@referralId')) {
      await AsyncStorage.removeItem('@referralId');
    }
  } catch (e) {}
};

export const setNewReferral = async (
  referralId: string,
  isChatOpen: boolean
) => {
  try {
    await AsyncStorage.setItem('@referralId', referralId);
  } catch (e) {
    return `Problem with saving new referral value. ${e}`;
  }
  try {
    if (isChatOpen) {
      const conversationId = await getData('@conversationId');
      const token = await getData('@token');
      if (token && conversationId) {
        await sendReferral(conversationId, token, referralId);
        return 'Success';
      } else {
        return 'Waiting';
      }
    }
    return 'Waiting';
  } catch (e) {
    return `Problem with saving new referral value. ${e}`;
  }
};
