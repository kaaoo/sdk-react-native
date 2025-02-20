import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  image: {
    width: 13,
    height: 13,
    marginRight: 8,
    position: 'relative',
    bottom: 2,
  },
  infoText: {
    textAlign: 'left',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 12,
  },
  linkText: { textDecorationLine: 'underline' },
});
export default styles;
