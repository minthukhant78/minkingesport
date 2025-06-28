import type { Game, Review, UserProfile, VideoHighlight, UserData, TeamMember, Creator, FAQ } from './types';
import { db } from './firebase';
import { collection, getDocs, query, where, limit, doc, runTransaction, arrayUnion, getDoc, setDoc, addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export async function getAllGames(): Promise<Game[]> {
  const gamesCol = collection(db, 'games');
  const gameSnapshot = await getDocs(gamesCol);
  const gameList = gameSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
  return gameList;
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const q = query(collection(db, "games"), where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return undefined;
  }

  const gameDoc = querySnapshot.docs[0];
  return { ...gameDoc.data(), id: gameDoc.id } as Game;
}

export async function addReviewToGame(gameId: string, newReview: Omit<Review, 'id'>) {
  const gameRef = doc(db, 'games', gameId);
  const userRef = doc(db, 'users', newReview.authorId);

  try {
    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef);
      const userDoc = await transaction.get(userRef);

      if (!gameDoc.exists()) {
        throw "Document does not exist!";
      }

      const gameData = gameDoc.data() as Game;
      
      const currentRating = gameData.rating || 0;
      const currentReviewsCount = gameData.reviewsCount || 0;

      const newReviewsCount = currentReviewsCount + 1;
      const newTotalRating = (currentRating * currentReviewsCount) + newReview.rating;
      const newAverageRating = newTotalRating / newReviewsCount;

      const reviewWithTimestamp: Review = {
        ...newReview,
        createdAt: new Date().toISOString(),
      };

      transaction.update(gameRef, {
        reviews: arrayUnion(reviewWithTimestamp),
        reviewsCount: newReviewsCount,
        rating: newAverageRating,
      });
      
      // Update user's review count
      if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          const currentUserReviewsCount = userData.reviewsCount || 0;
          transaction.update(userRef, {
              reviewsCount: currentUserReviewsCount + 1,
          });
      }
    });
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw new Error("Could not submit review. Please try again.");
  }
}

export async function getUserActivity(userId: string): Promise<{ reviews: Review[], reviewedGames: Game[] }> {
    if (!userId) {
        return { reviews: [], reviewedGames: [] };
    }

    const allGames = await getAllGames();
    const userReviews: Review[] = [];
    const reviewedGamesWithDate: (Game & { reviewCreatedAt: string })[] = [];

    allGames.forEach(game => {
        if (game.reviews) {
            const reviewsForThisGame = game.reviews
                .filter(review => review.authorId === userId)
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            
            if (reviewsForThisGame.length > 0) {
                userReviews.push(...reviewsForThisGame);
                reviewedGamesWithDate.push({ 
                    ...game, 
                    reviewCreatedAt: reviewsForThisGame[0].createdAt || '1970-01-01T00:00:00.000Z' 
                });
            }
        }
    });

    reviewedGamesWithDate.sort((a, b) => new Date(b.reviewCreatedAt).getTime() - new Date(a.reviewCreatedAt).getTime());

    const reviewedGames = reviewedGamesWithDate.map(({ reviewCreatedAt, ...game }) => game as Game);

    return { reviews: userReviews, reviewedGames };
}

/**
 * Fetches a user's profile from Firestore. If it doesn't exist, it creates one.
 * It also ensures that the profile has the most up-to-date name and email from the auth user object.
 * This is the single source of truth for creating and retrieving user profiles.
 * @param user The Firebase Auth user object.
 * @returns The user's profile from Firestore.
 */
export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    try {
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            const updates: Partial<UserProfile> = {};

            // If auth user has a display name and profile's is a placeholder, update it.
            if (user.displayName && (!profile.name || profile.name === 'Anonymous User')) {
                updates.name = user.displayName;
            }
            if (user.email && (!profile.email || profile.email === 'No email provided')) {
                updates.email = user.email;
            }
             if (user.photoURL && profile.photoURL !== user.photoURL) {
                updates.photoURL = user.photoURL;
            }
            if (profile.reviewsCount === undefined) {
                updates.reviewsCount = 0;
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
                return { ...profile, ...updates };
            }
            
            return profile;
        } else {
            // Profile doesn't exist, create it.
            const newProfile: UserProfile = {
                name: user.displayName || 'Anonymous User',
                email: user.email || 'No email provided',
                role: 'user',
                photoURL: user.photoURL || '',
                bio: '',
                socialLink: '',
                reviewsCount: 0,
            };
            await setDoc(userRef, newProfile);
            return newProfile;
        }
    } catch (error) {
        console.error("Error fetching or creating user profile: ", error);
        // Return a fallback profile to prevent app crash
        return { 
            role: 'user',
            name: user.displayName || 'Error User',
            email: user.email || 'error@example.com',
            photoURL: user.photoURL || '',
            bio: 'Could not load profile.',
            socialLink: '',
            reviewsCount: 0,
        };
    }
}


export async function updateUserProfileData(userId: string, data: Partial<UserProfile>) {
    const userRef = doc(db, 'users', userId);
    try {
        await setDoc(userRef, data, { merge: true });
    } catch (e) {
        console.error("Failed to update user profile: ", e);
        throw new Error("Could not update user profile.");
    }
}

export async function createGame(gameData: Omit<Game, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) {
    try {
        const newGameData = {
            ...gameData,
            rating: 0,
            reviewsCount: 0,
            reviews: [],
        };
        const docRef = await addDoc(collection(db, 'games'), newGameData);
        const newDoc = await getDoc(docRef);
        return { ...newDoc.data(), id: newDoc.id } as Game;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not create game.");
    }
}

export async function updateGame(gameId: string, gameData: Partial<Omit<Game, 'id'>>) {
    const gameRef = doc(db, 'games', gameId);
    try {
        await updateDoc(gameRef, gameData);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw new Error("Could not update game.");
    }
}

export async function deleteGame(gameId: string) {
    const gameRef = doc(db, 'games', gameId);
    try {
        await deleteDoc(gameRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete game.");
    }
}

// Video Highlights
export async function getAllVideoHighlights(): Promise<VideoHighlight[]> {
  const highlightsCol = collection(db, 'video_highlights');
  const q = query(highlightsCol, orderBy('order', 'asc'));
  const highlightsSnapshot = await getDocs(q);
  return highlightsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as VideoHighlight));
}

export async function createVideoHighlight(highlightData: Omit<VideoHighlight, 'id'>): Promise<VideoHighlight> {
    const docRef = await addDoc(collection(db, 'video_highlights'), highlightData);
    const newDoc = await getDoc(docRef);
    return { ...newDoc.data(), id: newDoc.id } as VideoHighlight;
}

export async function updateVideoHighlight(highlightId: string, highlightData: Partial<Omit<VideoHighlight, 'id'>>) {
    const highlightRef = doc(db, 'video_highlights', highlightId);
    await updateDoc(highlightRef, highlightData);
}

export async function deleteVideoHighlight(highlightId: string) {
    const highlightRef = doc(db, 'video_highlights', highlightId);
    await deleteDoc(highlightRef);
}


// User Management
export async function getAllUserProfiles(): Promise<UserData[]> {
  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  return usersSnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as UserData));
}

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
    const userRef = doc(db, 'users', userId);
    try {
        await updateDoc(userRef, { role });
    } catch(e) {
        console.error("Error updating user role:", e);
        throw new Error("Could not update user role.");
    }
}

// Team Members
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const membersCol = collection(db, 'team_members');
  const q = query(membersCol, orderBy('order', 'asc'));
  const membersSnapshot = await getDocs(q);
  return membersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TeamMember));
}

export async function createTeamMember(memberData: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const docRef = await addDoc(collection(db, 'team_members'), memberData);
    const newDoc = await getDoc(docRef);
    return { ...newDoc.data(), id: newDoc.id } as TeamMember;
}

export async function updateTeamMember(memberId: string, memberData: Partial<Omit<TeamMember, 'id'>>) {
    const memberRef = doc(db, 'team_members', memberId);
    await updateDoc(memberRef, memberData);
}

export async function deleteTeamMember(memberId: string) {
    const memberRef = doc(db, 'team_members', memberId);
    await deleteDoc(memberRef);
}

// Creators
export async function getAllCreators(): Promise<Creator[]> {
  const creatorsCol = collection(db, 'creators');
  const q = query(creatorsCol, orderBy('order', 'asc'));
  const creatorsSnapshot = await getDocs(q);
  return creatorsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Creator));
}

export async function createCreator(creatorData: Omit<Creator, 'id'>): Promise<Creator> {
    const docRef = await addDoc(collection(db, 'creators'), creatorData);
    const newDoc = await getDoc(docRef);
    return { ...newDoc.data(), id: newDoc.id } as Creator;
}

export async function updateCreator(creatorId: string, creatorData: Partial<Omit<Creator, 'id'>>) {
    const creatorRef = doc(db, 'creators', creatorId);
    await updateDoc(creatorRef, creatorData);
}

export async function deleteCreator(creatorId: string) {
    const creatorRef = doc(db, 'creators', creatorId);
    await deleteDoc(creatorRef);
}

// FAQs
export async function getAllFAQs(): Promise<FAQ[]> {
  const faqsCol = collection(db, 'faqs');
  const q = query(faqsCol, orderBy('order', 'asc'));
  const faqsSnapshot = await getDocs(q);
  return faqsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FAQ));
}

export async function createFAQ(faqData: Omit<FAQ, 'id'>): Promise<FAQ> {
    const docRef = await addDoc(collection(db, 'faqs'), faqData);
    const newDoc = await getDoc(docRef);
    return { ...newDoc.data(), id: newDoc.id } as FAQ;
}

export async function updateFAQ(faqId: string, faqData: Partial<Omit<FAQ, 'id'>>) {
    const faqRef = doc(db, 'faqs', faqId);
    await updateDoc(faqRef, faqData);
}

export async function deleteFAQ(faqId: string) {
    const faqRef = doc(db, 'faqs', faqId);
    await deleteDoc(faqRef);
}
