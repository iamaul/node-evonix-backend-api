module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        name: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        email: { type: DataTypes.STRING(100) },
        email_verified: { type: DataTypes.TINYINT },
        pass: { type: DataTypes.STRING(129) },
        ipv4: { type: DataTypes.INTEGER(11) },
        regdate: { type: DataTypes.INTEGER(11) },
        admin: { type: DataTypes.INTEGER(11) },
        lastlog: { type: DataTypes.INTEGER(11) },
        register_ip: { type: DataTypes.STRING(20) },
        login_ip: { type: DataTypes.STRING(20) }
    }, { tableName: 'users' });
}