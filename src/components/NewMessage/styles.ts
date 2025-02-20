import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  inputContainer: {
    flex: 1,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: 4,
    width: 92,
  },
  sendButton: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentImg: {
    width: 18,
    height: 18,
  },
  sendImg: {
    width: 20,
    height: 20,
  },
});
export default styles;
