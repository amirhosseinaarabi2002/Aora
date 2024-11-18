import { Account, Avatars, Client, Databases, ID, Storage } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.vada.aora",
  projectId: "673b82d10021f676c5ad",
  storageId: "673b8bb10014eee529d4",
  databaseId: "673b84db0013f939f086",
  userCollectionId: "673b8515002c572ea28b",
  videoCollectionId: "673b86080015e47deb82",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

  const account = new Account(client);
  const storage = new Storage(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);  

// Register user
export async function createUser(email, password, username) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Sign In
export async function signIn(email, password) {
    try {
      const session = await account.createEmailSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }