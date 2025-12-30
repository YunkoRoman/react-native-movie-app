import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");
const TAB_BAR_MARGIN = 20;
const TAB_BAR_WIDTH = width - TAB_BAR_MARGIN * 2;

const TAB_ICON_MAP: Record<string, any> = {
  index: icons.home,
  search: icons.search,
  save: icons.save,
  profile: icons.person,
};

function TabItem({ icon, title, index, activeIndex }: any) {
  const animatedIconStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      activeIndex.value,
      [index - 0.5, index, index + 0.5],
      ["#A8B5DB", "#151312", "#A8B5DB"]
    );

    return {
      tintColor: color,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const distance = Math.abs(activeIndex.value - index);
    const opacity = Math.max(0, 1 - distance * 2);

    return {
      opacity: opacity,
      transform: [
        { translateX: (1 - opacity) * 10 },
        { scale: 0.9 + opacity * 0.1 }
      ]
    };
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.Image
        source={icon}
        style={[{ width: 20, height: 20 }, animatedIconStyle]}
      />
      <View style={{ overflow: 'hidden' }}>
        <Animated.Text
          numberOfLines={1}
          style={[
            { fontSize: 14, fontWeight: "600", color: "#151312", marginLeft: 6 },
            animatedTextStyle
          ]}
        >
          {title}
        </Animated.Text>
      </View>
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
  }, [state.index]);

  const numTabs = state.routes.length;
  const tabWidth = TAB_BAR_WIDTH / numTabs;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeIndex.value * tabWidth }],
    };
  });

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarBackground}>
        <Animated.View
          style={[
            styles.indicator,
            { width: tabWidth },
            indicatorStyle
          ]}
        >
          <Image
            source={images.highlight}
            style={styles.indicatorImage}
            resizeMode="stretch"
          />
        </Animated.View>

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{ flex: 1, height: 52, justifyContent: "center", alignItems: "center" }}
            >
              <TabItem
                icon={TAB_ICON_MAP[route.name]}
                title={label}
                index={index}
                activeIndex={activeIndex}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          title: "Save",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 36,
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarBackground: {
    flexDirection: "row",
    backgroundColor: "#0F0D23",
    borderRadius: 50,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0F0D23",
  },
  indicator: {
    position: "absolute",
    height: "100%",
    padding: 0,
  },
  indicatorImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  }
});