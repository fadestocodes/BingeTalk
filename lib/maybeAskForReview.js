import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";


const LAST_REVIEW_PROMPT_KEY = "last_review_prompted";
const HAS_GIVEN_REVIEW_KEY = "has_given_review";
const DAYS_BEFORE_NEXT_PROMPT = 7   ;

export const maybeAskForReview = async () => {
    const lastPrompt = await AsyncStorage.getItem(LAST_REVIEW_PROMPT_KEY);
    const now = Date.now();
    
    // Check if enough time has passed
    const shouldAsk =
    !lastPrompt ||
    now - parseInt(lastPrompt, 10) > DAYS_BEFORE_NEXT_PROMPT * 86400000;
    
    if (!shouldAsk) return;
    
    const canShow = await StoreReview.hasAction();
    if (canShow) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(LAST_REVIEW_PROMPT_KEY, now.toString());
    }
  };
  