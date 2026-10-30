### FORMAT

### METHOD /path

**Auth:** public | protected
**Request body:** TypeName or "none"
**Query params:** TypeName or "none"
**Success response:** TypeName, status code
**Errors:** list of (status, when)

### Notes

- all routes may return 500 on internal errors

### Auth

#### POST /auth/register

Auth:public
Request body:RegisterDto
Query params: none
Success response: AuthResponse,201
Errors: 400 (not all request params) or 409 (such user exists)

#### POST /auth/login

Auth:public
Request body:LoginDto
Query params: none
Success response: AuthResponse,200
Errors: 400 (not all request params) or 401 (unauthorized)

#### GET /auth/me

Auth:protected
Request body:none
Query params: none
Success response: PublicUser,200
Errors: 401 (unauthorized)

### Posts

#### GET /posts

Auth:public
Request body:none
Query params: ListPostQuery
Success response: PaginatedPosts,200
Errors:none

#### GET /posts/:id

Auth:public
Request body:none
Query params: none
Success response: PostWithAuthor,200
Errors: 404 (resource not found)

#### POST /posts

Auth:protected
Request body:CreatePostDto
Query params: none
Success response: PostWithAuthor,201
Errors:400(validation failed — missing title/body, bad categoryId) 401 (unauthorized)

#### PATCH /posts/:id

Auth:protected
Request body:UpdatePostDto
Query params: none
Success response: PostWithAuthor,200
Errors:401 (unauthorized) 403 (forbidden) 404 (resource not found)

#### DELETE /posts/:id

Auth:protected
Request body:none
Query params: none
Success response: none,204
Errors:401 (unauthorized) 403 (forbidden) 404 (resource not found)

### Comments

#### GET /posts/:postId/comments

Auth:public
Request body:none
Query params: none
Success response: Paginated<CommentWithAuthor>,200
Errors:

#### POST /posts/:postId/comments

Auth:protected
Request body:CreateCommentDto
Query params: none
Success response: CommentWithAuthor,201
Errors:400 (body missing body field) 401 (unauthorized) 404(post with that :postId does not exist)

#### DELETE /comments/:id

Auth:protected
Request body:none
Query params: none
Success response: none,204
Errors:401 (unauthorized) 403 (forbidden) 404 (resource not found)

### Categories

#### GET /categories

Auth:public
Request body:none
Query params: none
Success response: Category[],200
Errors:
