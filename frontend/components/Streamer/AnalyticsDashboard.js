import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#0f0c29',
  backgroundGradientTo: '#302b63',
  color: (opacity = 1) => `rgba(255, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  barPercentage: 0.7,
  fillShadowGradient: '#1dc0bb',
  fillShadowGradientOpacity: 1,
};

const viewerData = {
  labels: ['Current Viewers', 'Peak Viewers'],
  datasets: [
    {
      data: [150, 200],
      colors: [
        (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
      ],
    },
    {
      data: [130, 180],
      colors: [
        (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
      ],
      label: 'Past Averages',
    },
  ],
};

const engagementData = {
  labels: ['Likes', 'Comments'],
  datasets: [
    {
      data: [120, 45],
      colors: [
        (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
      ],
    },
    {
      data: [100, 50],
      colors: [
        (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        (opacity = 1) => `rgba(255, 205, 86, ${opacity})`,
      ],
      label: 'Past Averages',
    },
  ],
};

const performanceData = {
  labels: ['Avg Watch Time (mins)', 'New Followers'],
  datasets: [
    {
      data: [5, 20],
      colors: [
        (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        (opacity = 1) => `rgba(255, 205, 86, ${opacity})`,
      ],
    },
    {
      data: [4, 18],
      colors: [
        (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      ],
      label: 'Past Averages',
    },
  ],
};

const AnalyticsDashboard = ({ navigation }) => {
  return (
    <ImageBackground source={require('/Users/mmc/Desktop/tiktok-live-quiz/frontend/assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Real-Time Analytics Dashboard</Text>
            <View style={styles.chartContainer}>
              <Text style={styles.metricTitle}>Viewer Metrics</Text>
              <BarChart
                data={viewerData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.metricTitle}>Engagement Levels</Text>
              <BarChart
                data={engagementData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
              />
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.metricTitle}>Performance Insights</Text>
              <BarChart
                data={performanceData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StreamerOptions')}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // semi-transparent background
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // darker semi-transparent background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1dc0bb',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // darker semi-transparent background
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1dc0bb',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1dc0bb',
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  chartStyle: {
    borderRadius: 16,
  },
});

export default AnalyticsDashboard;
