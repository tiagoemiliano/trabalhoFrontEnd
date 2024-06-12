import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/Card";
import Layout from "../components/Layout";

import { contentfulClient } from "../utils/createContentfulClient";

function ListPost() {
    const [categories, setCategories] = useState([]);
    const [posts, setListPosts] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getCategories = async () => {
        try {
            const response = await contentfulClient.getEntries({
                content_type: 'blogCategory5j',
            });
    
            setCategories(response.items);
        } catch (error) {
            console.log('Erro ao obter categorias', error);
            setCategories([]);
        }
    };

    const getListPosts = async (page = 1, limit = 2) => {
        try {
            const skip = (page - 1) * limit;
            const response = await contentfulClient.getEntries({
                content_type: 'blogPost5j',
                limit: limit,
                skip: skip,
                order: '-sys.createdAt',
            });
    
            const totalEntries = response.total;
            setTotalPages(Math.ceil(totalEntries / limit));
    
            setListPosts(response.items);
        } catch (error) {
            console.log('Erro ao obter posts', error);
            setListPosts([]);
        }
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    useEffect(() => {
        getCategories();
        getListPosts(currentPage);
    }, [currentPage]); // useEffect -> onLoad do componente Home

    return (
        <Layout>
            <div className="container my-4">
                <div className="row">
                    <main className="col-md-8">
                        <h2 className="mb-3">
                            Todos os Posts
                        </h2>
    
                        {posts.map((item) => (
                            <Card
                                key={item.sys.id}
                                title={item.fields.blogPostTitle}
                                text={item.fields.blogPostDescription}
                                link={'/post/' + item.fields.blogPostSlug}
                            />
                        ))}
    
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handlePrevPage}>
                                        Anterior
                                    </button>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link">{currentPage}</span>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handleNextPage}>
                                        Próximo
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <Link to="/Post" className="btn btn-dark mt-4">
                            Voltar à página inicial
                        </Link>                        
                    </main>
    
                    <aside className="col-md-4">
                        <h2>Categorias</h2>
                        <ul>
                            {categories.map((item) => (
                                <li key={item.sys.id}>{item.fields.blogCategoryTitle}</li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </Layout>
    );
}

export default ListPost;