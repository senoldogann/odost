import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  header: {
    marginBottom: 3,
    padding: 2,
    borderBottom: '1px solid #333',
  },
  logo: {
    width: 60,
    height: 'auto',
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  content: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff10',
    borderRadius: 5,
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 5,
  },
  amount: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 10,
  },
  footer: {
    marginTop: 'auto',
    padding: 10,
    borderTop: '1px solid #333',
  },
  companyInfo: {
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  }
});

interface GiftCardPDFProps {
  giftCard: {
    code: string;
    amount: number;
    createdAt: string;
    qrCode?: string;
    user: {
      name: string;
      email: string;
    };
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
      logo: string;
    };
  };
}

export const GiftCardPDF = ({ giftCard }: GiftCardPDFProps) => {
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.header}>
          <Image src={giftCard.companyInfo.logo} style={styles.logo} />
          <Text style={styles.title}>{giftCard.companyInfo.name}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.text}>Lahjakortti</Text>
          <Text style={styles.text}>Koodi: {giftCard.code}</Text>
          <Text style={styles.amount}>{giftCard.amount.toFixed(2)} €</Text>
          
          {giftCard.qrCode && (
            <Image src={giftCard.qrCode} style={styles.qrCode} />
          )}

          <Text style={styles.text}>Saaja: {giftCard.user.name}</Text>
          <Text style={styles.text}>Sähköposti: {giftCard.user.email}</Text>
          <Text style={styles.text}>
            Myöntämispäivä: {new Date(giftCard.createdAt).toLocaleDateString('fi-FI')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.companyInfo}>{giftCard.companyInfo.name}</Text>
          <Text style={styles.companyInfo}>{giftCard.companyInfo.address}</Text>
          <Text style={styles.companyInfo}>
            Puh: {giftCard.companyInfo.phone} | Email: {giftCard.companyInfo.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default GiftCardPDF; 