/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"

import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

import { AuthenticatedStack } from "../features/Home/navigation/AuthenticatedNavigator"
import { OnboardingStack } from "../features/Onboarding/navigation/OnboardingNavigator"
import { useStores } from "../models"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */

export type AppStackParamList = {
  Authenticated: undefined
  Onboarding: undefined
  // 🔥 Your screens go here
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>
// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { authenticationStore } = useStores()
  console.log("authenticationStore.isAuthenticated", authenticationStore.isAuthenticated)
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={authenticationStore.isAuthenticated ? "Authenticated" : "Onboarding"}
    >
      {authenticationStore.isAuthenticated ? (
        <Stack.Screen name="Authenticated" component={AuthenticatedStack} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      )}
      {/** 🔥 Your screens go here */}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
