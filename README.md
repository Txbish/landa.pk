### 📦 **Landa.pk**

An interactive and user-friendly e-commerce thrift store built using the MERN stack (Next.js, React, Node.js, Express, MongoDB). The project includes a separate admin panel for managing users, products, and orders efficiently.

---

## 🌟 **Features**

### 🔥 **User Features**
- **User Registration & Login** (JWT/OAuth authentication)  
- **Responsive Design** with Dark Mode Toggle  
- **Product Listings** with Search and Filters  
- **Wishlist & Favorites** to save items for later  
- **Profile Management** (update personal details and view order history)  
- **Dynamic Content Rendering** using API calls  

---

### 🛠️ **Admin Panel Features**
- **Dashboard & Analytics** for user activity and orders  
- **User Management** (Block/Unblock, Assign Roles)  
- **Product & Content Management** (Add, Edit, Delete)  
- **Role Management** (Add/Edit Permissions)  
- **Activity Logs** for security auditing  

---

## 💻 **Tech Stack**

### 🌐 **Frontend**
- **Next.js** - React framework for SSR and routing  
- **React** - Component-based UI library  
- **Tailwind CSS** - Utility-first CSS framework  
- **Axios** - API calls  
- **React Query** - Data fetching and caching  
- **React Admin** - Admin dashboard  

### 🛑 **Backend**
- **Node.js** - Server environment  
- **Express.js** - Web framework for Node  
- **JWT** - Authentication  
- **Mongoose** - MongoDB object modeling  

### 🗃️ **Database**
- **MongoDB Atlas** - Cloud database  
- **Mongoose** - Schema-based data modeling  

---

## 🚀 **Deployment**
- **Frontend:** Vercel  
- **Backend:** AWS/DigitalOcean/Railway  
- **Database:** MongoDB Atlas  
- **Version Control:** GitHub  

---

## 📝 **Setup Instructions**

### ⚙️ **Clone the repository**
```bash
git clone https://github.com/yourusername/thrift-store.git
cd thrift-store
```

### 📁 **Install dependencies**
#### Frontend
```bash
cd client
npm install
```
#### Backend
```bash
cd server
npm install
```

### 🗝️ **Environment Variables**
Create a `.env` file in both `client` and `server` directories:
#### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
#### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/thrift-store
JWT_SECRET=your_jwt_secret
```

### 🏃 **Running the application**
#### Frontend
```bash
cd client
npm run dev
```
#### Backend
```bash
cd server
npm start
```

---

## 🧪 **Testing**
- Unit Testing: Jest  
- Integration Testing: Mocha & Chai  
- Manual Testing: Browser and Mobile Responsiveness  

---

## 📊 **Project Structure**
```
thrift-store/
├── client/               # Frontend code
├── server/               # Backend code
├── .gitignore
├── README.md
└── package.json
```

---

## 🚦 **Roadmap**
- [x] User Authentication & Authorization  
- [x] Product Listings & Search  
- [x] Wishlist & Favorites  
- [x] Admin Dashboard  
- [ ] Payment Gateway Integration  
- [ ] Order Management System  
- [ ] Enhanced Security Features  

---

## 📝 **Contributing**
Feel free to submit issues and pull requests! Make sure to follow the contribution guidelines.  

---

## 🛡️ **License**
This project is licensed under the MIT License.  

---

## 📧 **Contact**
For any inquiries or support, feel free to reach out!  
- **Email:** yourname@example.com  
- **GitHub:** [yourusername](https://github.com/yourusername)  

---

Happy Coding! 💻🚀

Let me know if you’d like any tweaks or additions to this README!
