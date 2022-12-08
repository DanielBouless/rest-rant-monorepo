import { Context } from "react";
import { CurrentUser as CU, CurrentUser } from "../contexts/CurrentUser"
interface Comment {
    authorId: number;
    author: {
        firstName: string;
        lastName: string;
    };
    rant: string;
    stars: boolean;
}

interface CURRENTUSER {
    userId: number
}


function CommentCard({ comment, onDelete }:{comment:Comment, onDelete: any}) {
    const {currentUser}: any = useContext(CurrentUser)

    let deleteButton = null;

    if (currentUser?.userId === comment.authorId) {
        deleteButton = (
            <button className="btn btn-danger" onClick={onDelete} >
                Delete Comment
            </button>
        )
    }
    return (
        <div className="border col-sm-4">
            <h2 className="rant">{comment.rant ? 'Rant! ðŸ˜¡' : 'Rave! ðŸ˜»'}</h2>
            <h3>
                <strong>- {comment.author.firstName} {comment.author.lastName}</strong>
            </h3>
            <h4>Rating: {comment.stars}</h4>
            {deleteButton}
        </div>
    )
}


export default CommentCard;

function useContext(CurrentUser: Context<any>): any {
    throw new Error("Function not implemented.");
}

